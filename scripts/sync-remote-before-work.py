#!/usr/bin/env python3
"""Sync selected files from GitHub before local edits.

This is the shared Codex/Hermes handoff guard:
1. Read the latest GitHub main SHA.
2. Pull important project files from GitHub into the local workspace.
3. Save .remote-sync-state.json so push scripts can refuse stale overwrites.

Usage:
  python3 scripts/sync-remote-before-work.py
  python3 scripts/sync-remote-before-work.py index.html course-data.js

Set REPO=zqlwelcome/learning-platform and LEARNING_PLATFORM_DIR if needed.
"""

import base64
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("REPO", "zqlwelcome/learning-platform")
BASE = Path(os.environ.get("LEARNING_PLATFORM_DIR", os.getcwd()))
STATE_FILE = BASE / ".remote-sync-state.json"

DEFAULT_FILES = [
    "index.html",
    "style.css",
    "daily-data.js",
    "news-loader.js",
    "course-data.js",
    "course-series-data.js",
    "course-app.js",
    "course-center-app.js",
    "course-center-style.css",
    "app.js",
    "share.js",
    "holdings-data.js",
    "holdings-render.js",
    "data/alerts.json",
    "data/expert-views.json",
    "data/global-flow.json",
    "data/hot-news.json",
    "data/paper-trades.json",
]


def run(args, *, input_text=None):
    result = subprocess.run(
        args,
        input=input_text,
        capture_output=True,
        text=True,
        cwd=BASE,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result.stdout.strip()


def remote_head():
    return run(["gh", "api", f"repos/{REPO}/branches/main", "--jq", ".commit.sha"])


def recent_commits(limit=8):
    output = run([
        "gh",
        "api",
        f"repos/{REPO}/commits",
        "--jq",
        f".[:{limit}][] | [.sha[0:7], .commit.author.date, .commit.message] | @tsv",
    ])
    return output.splitlines() if output else []


def dirty_files(files):
    output = run(["git", "status", "--porcelain", "--", *files])
    return [line for line in output.splitlines() if line.strip()]


def fetch_file(path):
    data = run([
        "gh",
        "api",
        f"repos/{REPO}/contents/{path}?ref=main",
        "--jq",
        ".content",
    ])
    content = base64.b64decode(data.encode()).decode("utf-8")
    full_path = BASE / path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    full_path.write_text(content, encoding="utf-8")


def main():
    files = sys.argv[1:] or DEFAULT_FILES
    files = [f.strip("/") for f in files if f.strip()]
    if not files:
        print("No files requested.")
        return

    dirty = dirty_files(files)
    if dirty:
        print("Refusing to overwrite local uncommitted changes:")
        for line in dirty:
            print(f"  {line}")
        print("Commit/stash them first, or pass only clean files.")
        sys.exit(2)

    head = remote_head()
    print(f"GitHub main: {head[:7]}")
    print("Recent remote commits:")
    for line in recent_commits():
        print(f"  {line}")

    pulled = []
    for path in files:
        try:
            fetch_file(path)
            pulled.append(path)
            print(f"  synced {path}")
        except Exception as exc:
            print(f"  skipped {path}: {exc}")

    state = {
        "repo": REPO,
        "remote_head": head,
        "synced_at": datetime.now(timezone.utc).isoformat(),
        "files": pulled,
    }
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved sync state: {STATE_FILE.name}")


if __name__ == "__main__":
    main()
