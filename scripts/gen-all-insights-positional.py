#!/usr/bin/env python3
"""
Generate AI insights for ALL news items with strict positional mapping.
This script avoids the content-matching fallback that causes misalignment.

Use when:
- auto-update log shows "⚠️ AI返回X条解读但请求Y条，使用内容匹配"
- Manual inspection shows insights assigned to wrong news items
- Need guaranteed correct 1:1 insight-to-news alignment

Strategy: Prompt the AI to return exactly N objects in strict order,
then map positionally. No keyword matching, no fallback assignment.
"""
import json, os, re, requests
from datetime import datetime

os.environ.setdefault('NO_PROXY', '*')

REPO_DIR = "/tmp/learning-platform"
NEWS_FILE = os.path.join(REPO_DIR, "data", "hot-news.json")
API_URL = "https://api.deepseek.com/v1/chat/completions"

def load_api_key():
    env_key = os.environ.get('DEEPSEEK_API_KEY', '').strip()
    if env_key:
        return env_key
    for env_path in [os.path.expanduser('~/.hermes/.env'),
                     os.path.expanduser('~/.hermes/env/.env')]:
        try:
            with open(env_path) as f:
                for line in f:
                    if line.startswith('DEEPSEEK_API_KEY='):
                        key = line.strip().split('=', 1)[1].strip()
                        if key:
                            return key
        except FileNotFoundError:
            continue
    raise RuntimeError("DEEPSEEK_API_KEY not found in .env or environment")

def parse_json_response(content_str):
    """Multi-strategy JSON parser for LLM responses."""
    content_str = re.sub(r'^```(?:json)?\s*', '', content_str.strip())
    content_str = re.sub(r'\s*```\s*$', '', content_str.strip())

    start = content_str.find("[")
    end = content_str.rfind("]")
    if start == -1:
        raise ValueError(f"No JSON array found (len={len(content_str)})")
    end = end + 1 if end >= start else len(content_str)

    raw = content_str[start:end]
    # Fix trailing commas
    fixed = re.sub(r',\s*([}\]])', r'\1', raw)

    try:
        return json.loads(fixed)
    except json.JSONDecodeError:
        pass

    # Walk char-by-char, escaping control chars in strings
    escaped = []
    in_str = False
    for ch in fixed:
        if ch == '"':
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
        return json.loads(''.join(escaped))
    except json.JSONDecodeError:
        pass

    # Repair truncated JSON
    json_str = ''.join(escaped)
    open_braces = json_str.count('{') - json_str.count('}')
    open_brackets = json_str.count('[') - json_str.count(']')
    quote_count = json_str.count('"')
    if quote_count % 2 != 0:
        json_str += '"'
    repair = json_str + '}' * max(0, open_braces) + ']' * max(0, open_brackets)
    return json.loads(repair)

def main():
    api_key = load_api_key()
    print(f"🔑 API key loaded")

    # Load current news
    with open(NEWS_FILE) as f:
        news_data = json.load(f)

    news_items = news_data['news']
    n = len(news_items)
    print(f"📰 {n} news items")

    # Remove all existing insights (they may be mismatched)
    for item in news_items:
        item.pop('insight', None)

    # Build prompt: strict ordering, exact count
    news_text = '\n'.join(f"{i+1}. {item['title']}" for i, item in enumerate(news_items))

    prompt = f"""你是华尔街资深交易员，用交易员思维解读以下新闻。

每条新闻输出4个字段（JSON数组）：
- what: 一句话说清楚发生了什么（25字内）
- assets: 受影响的资产及方向，格式如"📈 美股科技股 利好"或"📉 人民币 承压"（可多个）
- chain: 传导链/二阶效应，这件事会怎么影响其他东西（40字内，术语括号解释）
- watch: 下一步盯什么指标/事件来确认（25字内）

要求：
- 直接说结论，不要废话
- 术语要括号解释（如"降息（借钱成本降低）"）
- assets必须具体到资产类别，不要笼统说"市场"
- 严格按照新闻编号顺序，每条新闻对应一个JSON对象
- 只输出JSON

{news_text}

格式：[{{"what":"..","assets":"..","chain":"..","watch":".."}}]（必须恰好{n}个对象，严格按照1~{n}编号顺序）"""

    print(f"🤖 Calling DeepSeek API (max_tokens=3000)...")
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "资深交易员，简洁直接，术语括号解释。严格按照顺序输出，不多不少。"},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 3000
    }

    response = requests.post(API_URL, headers=headers, json=data, timeout=60)
    response.raise_for_status()

    result = response.json()
    content_str = result["choices"][0]["message"]["content"]
    finish_reason = result["choices"][0].get("finish_reason", "?")
    print(f"   finish_reason={finish_reason}, response_len={len(content_str)}")

    insights = parse_json_response(content_str)
    print(f"   parsed {len(insights)} insights")

    if len(insights) != n:
        print(f"⚠️ Count mismatch: got {len(insights)}, expected {n}")
        if len(insights) < n:
            print(f"   Truncating news_items to match ({len(insights)} items will get insights)")
            # Still assign positionally — remaining items stay without insight
        insights = insights[:n]

    # Strict positional assignment — no content matching
    for i, insight in enumerate(insights):
        if i < len(news_items):
            news_items[i]['insight'] = insight

    news_data['updateTime'] = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Save
    with open(NEWS_FILE, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)

    # Verify
    with_insight = sum(1 for n in news_items if n.get('insight'))
    print(f"\n✅ Saved: {with_insight}/{n} items have insights")

    # Print alignment check
    print("\n=== Alignment Check ===")
    for item in news_items:
        rank = item['rank']
        title = item['title'][:50]
        insight = item.get('insight', {})
        what = insight.get('what', 'MISSING')
        print(f"#{rank:2d}: {what}")

if __name__ == "__main__":
    main()
