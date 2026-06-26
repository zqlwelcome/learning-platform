#!/usr/bin/env python3
"""Quick audit of hot-news.json AI insights — missing count, side-by-side, previous-run matches, mismatch detection.
Usage: python3 scripts/quick-audit.py
Output: (1) missing count, (2) full side-by-side, (3) previous-run title match report, (4) auto mismatch detection via keyword overlap.
"""

import json, subprocess, sys

DATA_PATH = '/tmp/learning-platform/data/hot-news.json'
REPO_PATH = '/tmp/learning-platform'

with open(DATA_PATH) as f:
    d = json.load(f)

news = d.get('news', [])
print(f"=== QUICK AUDIT: {len(news)} news items, updateTime={d.get('updateTime', '?')} ===\n")

# 1. Missing check
missing = [(i, n['title'], n.get('source', '?')) for i, n in enumerate(news)
           if not n.get('insight') or not n['insight'].get('what')]
if missing:
    print(f'❌ {len(missing)}/{len(news)} items MISSING insights:')
    for idx, title, src in missing:
        print(f'  Rank {idx+1} [{src}]: {title[:100]}')
else:
    print(f'✅ All {len(news)} items have insights')
print()

# 2. Side-by-side
print("=== SIDE-BY-SIDE ===")
for n in news:
    ins = n.get('insight', {})
    what = ins.get('what', '---') if ins else '---'
    assets = ins.get('assets', '---') if ins else '---'
    watch = ins.get('watch', '---') if ins else '---'
    print(f"Rank {n['rank']:2d} [{n['source']}]: {n['title'][:80]}")
    print(f"       what:   {what[:80]}")
    print(f"       assets: {assets[:80]}")
    print(f"       watch:  {watch[:80]}")
    print()

# 3. Previous-run title match report
print("=== PREVIOUS RUN MATCHES ===")
try:
    r = subprocess.run(['git', 'show', 'HEAD~1:data/hot-news.json'],
                       capture_output=True, text=True, cwd=REPO_PATH, timeout=10)
    if r.returncode == 0:
        prev = json.loads(r.stdout)
        prev_map = {n['title']: n.get('insight', {}) for n in prev['news']
                    if n.get('insight', {}).get('what')}
        match = 0
        for n in news:
            if n['title'] in prev_map:
                match += 1
                if not (n.get('insight') and n['insight'].get('what')):
                    print(f'  Rank {n["rank"]}: TITLE MATCH — can reuse! (currently missing)')
            else:
                has_insight = n.get('insight') and n['insight'].get('what')
                if has_insight:
                    print(f'  Rank {n["rank"]}: NEW title (insight already present from current run): {n["title"][:80]}')
                else:
                    print(f'  Rank {n["rank"]}: NEW title → needs DeepSeek: {n["title"][:80]}')
        print(f'\n  {match}/{len(news)} titles match previous run')
    else:
        print(f'  git show failed: {r.stderr[:200]}')
except Exception as e:
    print(f'  Error: {e}')

# 4. MISMATCH DETECTION — keyword overlap between title and insight.what
#   If a rank's insight has low overlap with its own title but high overlap with another
#   rank's title, it's likely a swap. Catches continuous chain misassignments (e.g.
#   2→10→8→4→2, 3↔7) without manual scanning.
print("\n=== MISMATCH DETECTION (title ↔ insight keyword overlap) ===")
import re

def tokenize(text):
    """Extract CJK chars + latin words, normalize."""
    tokens = set()
    # CJK: individual characters (bigram would be too sparse for short headlines)
    tokens.update(re.findall(r'[\u4e00-\u9fff]', text))
    # Latin: lowercase words >= 3 chars
    tokens.update(w.lower() for w in re.findall(r'[a-zA-Z]{3,}', text))
    # Numbers
    tokens.update(re.findall(r'\d+', text))
    return tokens

flagged = []
cross_lang_suppressed = []
for n in news:
    if not n.get('insight') or not n['insight'].get('what'):
        continue
    title_toks = tokenize(n['title'])
    insight_toks = tokenize(n['insight']['what'])
    if not title_toks or not insight_toks:
        continue
    # Overlap ratio: how many title keywords appear in the insight
    overlap = len(title_toks & insight_toks)
    ratio = overlap / len(title_toks) if title_toks else 0

    if ratio < 0.10:  # Less than 10% title keywords in insight → suspicious
        # Cross-language false positive check: English title + Chinese insight
        # CJK chars in title vs CJK chars in insight
        title_cjk = len(re.findall(r'[\u4e00-\u9fff]', n['title']))
        insight_cjk = len(re.findall(r'[\u4e00-\u9fff]', n['insight']['what']))
        # If title has few CJK chars (<5) and insight has many (>=5), it's a cross-language pair
        if title_cjk < 5 and insight_cjk >= 5:
            cross_lang_suppressed.append(n['rank'])
            continue  # Skip — cross-language tokenization gap, not a real mismatch

        # Find which other rank's title has best overlap with this insight
        best_rank, best_score = None, 0
        for other in news:
            if other['rank'] == n['rank']:
                continue
            other_toks = tokenize(other['title'])
            if not other_toks:
                continue
            score = len(insight_toks & other_toks) / len(other_toks)
            if score > best_score:
                best_score = score
                best_rank = other['rank']
        flagged.append((n['rank'], ratio, best_rank, best_score))

if cross_lang_suppressed:
    print(f'🔇 {len(cross_lang_suppressed)} cross-language pairs suppressed (false positive): Ranks {cross_lang_suppressed}')
if flagged:
    print(f'⚠️  {len(flagged)} potential mismatches detected:')
    for rank, self_ratio, swap_rank, swap_score in flagged:
        print(f'  Rank {rank:2d}: title↔insight overlap={self_ratio:.2f}  →  best match: Rank {swap_rank} (score={swap_score:.2f})')
elif not flagged and cross_lang_suppressed:
    print('✅ No real mismatches detected (all flags were cross-language false positives)')
elif not flagged:
    print('✅ No mismatches detected')
