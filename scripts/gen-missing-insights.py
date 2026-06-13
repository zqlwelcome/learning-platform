#!/usr/bin/env python3
"""
Generate AI insights ONLY for news items missing them.
Calls DeepSeek API via curl (VPN-proxy compatible).
Uses content-aware matching when LLM returns fewer insights than requested.

Incremental approach — does NOT touch items that already have valid insights.
This prevents the data degradation pitfall where regenerating ALL insights
replaces good data with potentially worse data when the LLM merges items.

Usage:
    python3 scripts/gen-missing-insights.py [--dry-run]
"""
import json, subprocess, re, os, sys

DRY_RUN = '--dry-run' in sys.argv

# === Load API key ===
def load_key():
    env_path = os.path.expanduser('~/.hermes/.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith('DEEPSEEK_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"').strip("'")
    return os.environ.get('DEEPSEEK_API_KEY', '')

api_key = load_key()
if not api_key:
    print("ERROR: No DEEPSEEK_API_KEY found in ~/.hermes/.env or env var")
    sys.exit(1)

# === Load news ===
with open('data/hot-news.json') as f:
    data = json.load(f)

news = data['news']
missing = [n for n in news if not n.get('insight')]
print(f"Total: {len(news)} items, {len(missing)} missing insights")

if not missing:
    print("All items have insights — nothing to do")
    sys.exit(0)

# === Build prompt (missing items only) ===
titles = [n['title'][:100] for n in missing]
titles_text = '\n'.join(f"{i+1}. {t}" for i, t in enumerate(titles))

system_prompt = (
    "你是华尔街资深交易员，用交易员思维解读以下新闻。"
    "每条输出4字段: what(一句话事实25字内), assets(受影响资产+方向), "
    "chain(传导链/二阶效应40字内，术语括号解释), watch(下一步盯什么指标/事件25字内)。"
    "JSON数组格式。"
)

payload = {
    "model": "deepseek-chat",
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": (
            f"解读以下{len(missing)}条新闻:\n{titles_text}\n\n"
            f"返回JSON数组，每条含what/assets/chain/watch四字段。"
        )}
    ],
    "max_tokens": 2000,
    "temperature": 0.3
}

# === Call DeepSeek via curl (VPN proxy compatible) ===
with open('/tmp/ds_insight_payload.json', 'w') as f:
    json.dump(payload, f)

print(f"\nCalling DeepSeek API for {len(missing)} items...")
result = subprocess.run([
    'curl', '-s', '--connect-timeout', '30', '--max-time', '120',
    'https://api.deepseek.com/v1/chat/completions',
    '-H', 'Content-Type: application/json',
    '-H', f'Authorization: Bearer {api_key}',
    '-d', '@/tmp/ds_insight_payload.json'
], capture_output=True, text=True)

if result.returncode != 0:
    print(f"curl failed: {result.stderr}")
    sys.exit(1)

try:
    response = json.loads(result.stdout)
except json.JSONDecodeError:
    print(f"API response not valid JSON: {result.stdout[:300]}")
    sys.exit(1)

if 'choices' not in response:
    print(f"API error: {response.get('error', result.stdout[:200])}")
    sys.exit(1)

content = response['choices'][0]['message']['content']
print(f"API response ({len(content)} chars)")

# === Multi-strategy JSON parser ===
def parse_json_response(content_str):
    """Parse JSON from LLM response with markdown fence, trailing comma,
    unescaped control chars, and truncation repair."""
    # Strip markdown code blocks
    content_str = re.sub(r'^```(?:json)?\s*', '', content_str.strip())
    content_str = re.sub(r'\s*```\s*$', '', content_str.strip())
    
    # Find boundaries (handle truncation)
    start = content_str.find("[")
    if start == -1:
        return None, "No JSON array found"
    end = content_str.rfind("]")
    if end == -1 or end <= start:
        end = len(content_str)  # truncated — let repair handle it
    else:
        end += 1
    raw = content_str[start:end]
    
    # Strategy 1: Fix trailing commas, then parse
    fixed = re.sub(r',\s*([}\]])', r'\1', raw)
    try:
        return json.loads(fixed), None
    except json.JSONDecodeError:
        pass
    
    # Strategy 2: Char-by-char escape for unescaped control chars in strings
    escaped = []
    in_str = False
    for i, ch in enumerate(fixed):
        if ch == '"' and (i == 0 or fixed[i-1] != '\\'):
            in_str = not in_str
            escaped.append(ch)
        elif in_str and ch == '\n':
            escaped.append('\\n')
        elif in_str and ch == '\r':
            escaped.append('\\r')
        elif in_str and ch == '\t':
            escaped.append('\\t')
        else:
            escaped.append(ch)
    
    try:
        return json.loads(''.join(escaped)), None
    except json.JSONDecodeError:
        pass
    
    # Strategy 3: Repair truncated JSON
    json_str = ''.join(escaped)
    open_braces = json_str.count('{') - json_str.count('}')
    open_brackets = json_str.count('[') - json_str.count(']')
    if json_str.count('"') % 2 != 0:
        json_str += '"'
    repair = json_str + '}' * open_braces + ']' * open_brackets
    try:
        return json.loads(repair), None
    except json.JSONDecodeError as e:
        return None, f"All parse strategies failed: {e}"

insights, error = parse_json_response(content)

if error:
    print(f"Parse error: {error}")
    print(f"Raw content: {content[:500]}")
    sys.exit(1)

if not isinstance(insights, list):
    print(f"Expected array, got {type(insights)}")
    sys.exit(1)

print(f"Parsed {len(insights)} insights")

# === Content-aware matching ===
def tokenize(text):
    text = re.sub(r'[^\w\s]', ' ', text.lower())
    return set(t for t in text.split() if len(t) >= 2)

# Entity keywords for matching boost
ENTITIES = [
    'spacex', 'fed', 'federal', 'cfra', 'congress', 'house', 'republican',
    'pirro', 'sleep', 'number', 'ipo', '美债', '美联储', '加息', '和平',
    'nvidia', 'apple', 'bofa', 'softbank', '软银', 'openai', '特斯拉', 'tesla'
]

def score_match(insight, news_item):
    """Score how well an insight matches a news item by keyword overlap + entity boost."""
    what = insight.get('what', '') + ' ' + insight.get('assets', '') + ' ' + insight.get('chain', '')
    what_tokens = tokenize(what)
    title_tokens = tokenize(news_item['title'])
    overlap = len(what_tokens & title_tokens)
    # Entity boost: specific company/person/institution names
    for entity in ENTITIES:
        if entity in news_item['title'].lower():
            if entity in what.lower():
                overlap += 15
    return overlap

# Assign insights to missing items
assigned = set()
for insight in insights:
    best_score = -1
    best_idx = -1
    for i, item in enumerate(missing):
        if i in assigned:
            continue
        s = score_match(insight, item)
        if s > best_score:
            best_score = s
            best_idx = i
    if best_idx >= 0:
        missing[best_idx]['insight'] = insight
        assigned.add(best_idx)
        print(f"  ✅ #{missing[best_idx]['rank']} (score={best_score}): {insight.get('what', '')[:50]}")
    else:
        print(f"  ❌ Could not match insight: {insight.get('what', '')[:50]}")

# Update timestamp to ensure CDN picks up the change
from datetime import datetime
data['updateTime'] = datetime.now().strftime("%Y-%m-%d %H:%M")

if DRY_RUN:
    print("\n[Dry run — not saving]")
else:
    with open('data/hot-news.json', 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ Saved data/hot-news.json (updateTime: {data['updateTime']})")

final_missing = [n for n in news if not n.get('insight')]
print(f"Final: {len(news)-len(final_missing)}/{len(news)} have insights")
if final_missing:
    print("Still missing:")
    for n in final_missing:
        print(f"  #{n['rank']} {n['title'][:60]}")
