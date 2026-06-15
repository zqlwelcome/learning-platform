#!/usr/bin/env python3
"""
gen-missing-insights.py - Incremental AI insight generator
Sends only MISSING news items to DeepSeek individually, avoiding the merging
problem that plagues the batch approach in auto-update-full.py.
"""
import json
import os
import re
import sys
import time
import requests

# ---- Key loading (mirrors auto-update-full.py) ----
def _load_deepseek_key():
    env_key = os.environ.get('DEEPSEEK_API_KEY', '').strip()
    if env_key:
        return env_key
    env_paths = [
        os.path.expanduser('~/.hermes/.env'),
        os.path.expanduser('~/.hermes/env/.env'),
    ]
    for env_path in env_paths:
        try:
            with open(env_path) as f:
                for line in f:
                    if line.startswith('DEEPSEEK_API_KEY='):
                        key = line.strip().split('=', 1)[1].strip()
                        if key:
                            return key
        except FileNotFoundError:
            continue
    return ''

DEEPSEEK_API_KEY = _load_deepseek_key()
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

HOT_NEWS_FILE = "data/hot-news.json"

def _parse_json_response(content_str):
    """Multi-strategy JSON parser (mirrors auto-update-full.py)."""
    content_str = re.sub(r'^```(?:json)?\s*', '', content_str.strip())
    content_str = re.sub(r'\s*```\s*$', '', content_str.strip())

    # Try to find a JSON object first (single item mode)
    obj_start = content_str.find("{")
    obj_end = content_str.rfind("}")
    if obj_start != -1 and obj_end != -1 and obj_end > obj_start:
        raw_obj = content_str[obj_start:obj_end + 1]
        fixed_obj = re.sub(r',\s*([}\]])', r'\1', raw_obj)
        try:
            return json.loads(fixed_obj), None
        except json.JSONDecodeError:
            pass

    # Fall back to array mode
    arr_start = content_str.find("[")
    if arr_start == -1:
        return None, f"No JSON found in response (len={len(content_str)})"
    arr_end = content_str.rfind("]")
    if arr_end == -1 or arr_end <= arr_start:
        arr_end = len(content_str)
    else:
        arr_end += 1

    raw = content_str[arr_start:arr_end]
    fixed = re.sub(r',\s*([}\]])', r'\1', raw)

    try:
        return json.loads(fixed), None
    except json.JSONDecodeError:
        pass

    # Char-by-char escape repair
    escaped = []
    in_str = False
    i = 0
    while i < len(fixed):
        ch = fixed[i]
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
        i += 1
    try:
        return json.loads(''.join(escaped)), None
    except json.JSONDecodeError as e:
        return None, f"JSON decode failed after repair: {e}"

def generate_single_insight(title, detail=""):
    """Generate insight for a single news item to avoid merging."""
    prompt = f"""你是华尔街资深交易员，用交易员思维解读下面这条新闻。

输出一个JSON对象（不是数组），包含4个字段：
- what: 一句话说清楚发生了什么（25字内）
- assets: 受影响的资产及方向，格式如"📈 美股科技股 利好"或"📉 人民币 承压"（可多个）
- chain: 传导链/二阶效应，这件事会怎么影响其他东西（40字内，术语括号解释）
- watch: 下一步盯什么指标/事件来确认（25字内）

要求：
- 直接说结论，不要废话
- 术语要括号解释（如"降息（借钱成本降低）"）
- assets必须具体到资产类别，不要笼统说"市场"
- 只输出JSON

新闻标题: {title}
{"补充信息: " + detail if detail else ""}

格式：{{"what":"..","assets":"..","chain":"..","watch":".."}}"""

    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}

    for attempt in range(2):
        max_tokens = 600 if attempt == 0 else 1000
        try:
            data = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "资深交易员，简洁直接，术语括号解释。只输出JSON对象。"},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": max_tokens
            }

            response = requests.post(DEEPSEEK_API_URL, headers=headers, json=data, timeout=30)
            response.raise_for_status()

            result = response.json()
            content_str = result["choices"][0]["message"]["content"]
            finish_reason = result["choices"][0].get("finish_reason", "?")

            insight, parse_error = _parse_json_response(content_str)
            if insight is not None:
                # If returned as array, take first element
                if isinstance(insight, list) and len(insight) > 0:
                    insight = insight[0]
                # Validate required fields
                required = ['what', 'assets', 'chain', 'watch']
                if all(k in insight for k in required):
                    return insight
                else:
                    missing_keys = [k for k in required if k not in insight]
                    if attempt == 0:
                        print(f"  ⚠️ Missing keys {missing_keys}, retrying...")
                        continue
                    else:
                        print(f"  ⚠️ Missing keys {missing_keys} after retry, using partial")
                        return insight

            if attempt == 0:
                print(f"  ⚠️ JSON解析失败 (finish={finish_reason}), retrying...")
                continue
            else:
                print(f"  ⚠️ JSON解析失败 after retry: {parse_error}")
                return None

        except requests.exceptions.Timeout:
            print(f"  ⚠️ API超时 (attempt {attempt+1})")
        except requests.exceptions.HTTPError as e:
            print(f"  ⚠️ API HTTP错误 (attempt {attempt+1}): {e}")
        except Exception as e:
            print(f"  ⚠️ API调用失败 (attempt {attempt+1}): {e}")

    return None

def main():
    if not DEEPSEEK_API_KEY:
        print("❌ DEEPSEEK_API_KEY not found")
        sys.exit(1)

    # Read current data
    with open(HOT_NEWS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    news = data['news']
    # Find items missing insight
    missing = [(i, item) for i, item in enumerate(news) if not item.get('insight')]

    if not missing:
        print("✅ All news items already have insights")
        return 0

    print(f"🔍 Found {len(missing)} items missing insights out of {len(news)} total")
    print()

    generated = 0
    for idx, item in missing:
        title = item.get('title', '')
        rank = item.get('rank', '?')
        detail = item.get('detail', '')
        lang = item.get('lang', 'en')

        print(f"  [{idx+1}/{len(news)}] #{rank} [{lang}] {title[:70]}...")
        insight = generate_single_insight(title, detail)

        if insight:
            news[idx]['insight'] = insight
            generated += 1
            print(f"    ✅ {insight.get('what', '?')}")
        else:
            print(f"    ❌ Failed to generate insight")

        # Small delay to avoid rate limits
        if idx < len(news) - 1:
            time.sleep(1)

    print()
    print(f"📊 Generated {generated}/{len(missing)} missing insights")

    if generated > 0:
        # Update timestamp
        from datetime import datetime
        data['updateTime'] = datetime.now().strftime("%Y-%m-%d %H:%M")

        # Write back
        with open(HOT_NEWS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Updated {HOT_NEWS_FILE}")

    return 0 if generated > 0 else 1

if __name__ == "__main__":
    sys.exit(main())
