#!/usr/bin/env python3
"""Recover AI insights from previous run when content-matching fallback misassigns them.

Use when pipeline output contains `⚠️ AI返回N条解读但请求M条` or `quick-audit.py`
reports mismatches. Prefers previous-run title matches (zero API calls) over DeepSeek
regeneration. Handles same-language duplicates (trailing " - CNBC" suffix variants)
and cross-language duplicates (English CNBC + Chinese 环球市场播报).

Usage: python3 scripts/recover-insights.py [--dry-run]
  --dry-run  Show what would change without writing to disk

Exit code 0 = recovered successfully (or nothing to fix)
Exit code 1 = some items still missing after recovery (needs DeepSeek)

Pipeline:
  1. Load current hot-news.json
  2. Load previous run (git show HEAD~1:data/hot-news.json)
  3. Build title→insight map from previous run
  4. For each current item with an exact title match → replace insight
  5. For same-language duplicates (title differs only by " - CNBC" / " - Reuters") → copy twin
  6. For cross-language duplicates (same event, different language) → reuse with adapted text
  7. Report any still-missing items that need DeepSeek generation
"""

import json
import subprocess
import sys
import re
from pathlib import Path

DATA_PATH = Path('/tmp/learning-platform/data/hot-news.json')
REPO_PATH = Path('/tmp/learning-platform')

DRY_RUN = '--dry-run' in sys.argv


def normalize_title(t: str) -> str:
    """Strip trailing source suffixes for duplicate detection."""
    for suffix in (' - CNBC', ' - Reuters', ' - The Verge', ' -'):
        if t.endswith(suffix):
            return t[: -len(suffix)].strip()
    return t.strip()


def load_current():
    with open(DATA_PATH) as f:
        return json.load(f)


def load_previous():
    r = subprocess.run(
        ['git', 'show', 'HEAD~1:data/hot-news.json'],
        capture_output=True, text=True, cwd=REPO_PATH, timeout=10
    )
    if r.returncode != 0:
        print(f'⚠️  Cannot load previous run: {r.stderr[:200]}')
        return {}
    prev = json.loads(r.stdout)
    return {
        n['title']: n.get('insight')
        for n in prev.get('news', [])
        if n.get('insight') and n['insight'].get('what')
    }


def detect_duplicates(news):
    """Return groups of duplicate ranks (same-language and cross-language)."""
    same_lang_pairs = []
    cross_lang_pairs = []

    norm_map = {}  # normalized_title → [(rank, title)]
    for n in news:
        nt = normalize_title(n['title'])
        norm_map.setdefault(nt, []).append((n['rank'], n['title']))

    for nt, items in norm_map.items():
        if len(items) > 1:
            ranks = [r for r, _ in items]
            same_lang_pairs.append(tuple(ranks))

    # Cross-language: detect by shared entity names
    entity_re = re.compile(r'(SpaceX|Tesla|Cerebras|OpenAI|Nvidia|Apple|Google|Meta|Amazon|Microsoft|CFTC|SEC|Fed|Morgan Stanley|UBS)')
    entity_map = {}  # entity → [(rank, title)]
    for n in news:
        entities = set(entity_re.findall(n['title']))
        for e in entities:
            entity_map.setdefault(e, []).append((n['rank'], n['title']))

    for entity, items in entity_map.items():
        if len(items) >= 2:
            ranks = sorted(set(r for r, _ in items))
            if tuple(ranks) not in same_lang_pairs:
                cross_lang_pairs.append(tuple(ranks))

    return same_lang_pairs, cross_lang_pairs


def main():
    d = load_current()
    news = d.get('news', [])
    prev_map = load_previous()

    if not prev_map:
        print('❌ No previous-run insights available — cannot recover')
        return 1

    print(f"Previous run: {len(prev_map)} titled insights")
    print(f"Current run: {len(news)} items\n")

    # Track fixes
    fixes = []
    rank_map = {n['rank']: n for n in news}

    # 1. Exact title match recovery
    for n in news:
        if n['title'] in prev_map:
            old = n.get('insight', {}).get('what', '---')
            new = prev_map[n['title']]['what']
            if old != new:
                n['insight'] = dict(prev_map[n['title']])
                fixes.append(f"Rank {n['rank']}: exact match → '{new[:50]}'")

    # 2. Same-language duplicate recovery
    same_lang, cross_lang = detect_duplicates(news)
    for group in same_lang:
        # Find one with insight, copy to others
        with_insight = [r for r in group if rank_map[r].get('insight', {}).get('what')]
        without = [r for r in group if not rank_map[r].get('insight', {}).get('what')]
        if with_insight and without:
            source = with_insight[0]
            ins = rank_map[source]['insight']
            for r in without:
                if not rank_map[r].get('insight') or not rank_map[r]['insight'].get('what'):
                    rank_map[r]['insight'] = dict(ins)
                    fixes.append(f"Rank {r}: same-lang dup ← Rank {source} '{ins['what'][:50]}'")

    # 3. Cross-language duplicate recovery
    for group in cross_lang:
        with_insight = [r for r in group if rank_map[r].get('insight', {}).get('what')]
        without = [r for r in group if not rank_map[r].get('insight', {}).get('what')]
        if with_insight and without:
            source = with_insight[0]
            src_ins = rank_map[source]['insight']
            for r in without:
                if not rank_map[r].get('insight') or not rank_map[r]['insight'].get('what'):
                    rank_map[r]['insight'] = dict(src_ins)
                    fixes.append(f"Rank {r}: cross-lang dup ← Rank {source} '{src_ins['what'][:50]}'")

    # Summary
    print(f"=== {len(fixes)} fixes applied ===")
    for f in fixes:
        print(f"  {f}")

    # Final check
    still_missing = [n['rank'] for n in news
                     if not n.get('insight') or not n['insight'].get('what')]
    correct = [n['rank'] for n in news
               if n.get('insight') and n['insight'].get('what')]

    print(f"\n✅ {len(correct)}/{len(news)} items have insights")
    if still_missing:
        print(f"❌ {len(still_missing)} still missing (need DeepSeek): Ranks {still_missing}")
    else:
        print("🎉 All items recovered!")

    if not DRY_RUN and fixes:
        with open(DATA_PATH, 'w') as f:
            json.dump(d, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Saved to {DATA_PATH}")
    elif DRY_RUN:
        print("\n🔍 --dry-run: no changes written")

    return 1 if still_missing else 0


if __name__ == '__main__':
    sys.exit(main())
