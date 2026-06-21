#!/usr/bin/env python3
"""Push files to GitHub via API (bypasses git push SSL/proxy issues).

Usage:
  python3 scripts/gh-push-files.py                    # auto-detect changed files from git diff
  python3 scripts/gh-push-files.py data/hot-news.json data/alerts.json  # explicit file list

Requires: gh CLI authenticated (gh auth status).
Repo: zqlwelcome/learning-platform (override with REPO env var).
"""

import base64
import json
import os
import subprocess
import sys

REPO = os.environ.get("REPO", "zqlwelcome/learning-platform")
REPO_DIR = os.environ.get("LEARNING_PLATFORM_DIR", "/tmp/learning-platform")
COMMIT_MSG = os.environ.get("COMMIT_MSG", f"auto: 数据更新 via gh-push-files.py")


def get_changed_files():
    """Get changed files from git diff."""
    result = subprocess.run(
        ["git", "diff", "--name-only", "HEAD~1"],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    if result.returncode == 0 and result.stdout.strip():
        return [f.strip() for f in result.stdout.strip().split("\n") if f.strip()]
    # Fallback: diff against working tree
    result = subprocess.run(
        ["git", "diff", "--name-only"],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    return [f.strip() for f in result.stdout.strip().split("\n") if f.strip()]


def get_file_sha(filepath):
    """Get current SHA of file on GitHub."""
    result = subprocess.run(
        ["gh", "api", f"repos/{REPO}/contents/{filepath}", "--jq", ".sha"],
        capture_output=True, text=True
    )
    if result.returncode == 0 and "Not Found" not in result.stdout:
        return result.stdout.strip()
    return None


def push_file(filepath, message):
    """Push a single file via GitHub API."""
    full_path = os.path.join(REPO_DIR, filepath)
    if not os.path.exists(full_path):
        return False, f"File not found: {full_path}"

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    encoded = base64.b64encode(content.encode()).decode()
    sha = get_file_sha(filepath)

    data = {"message": message, "content": encoded, "branch": "main"}
    if sha:
        data["sha"] = sha

    tmp_file = "/tmp/gh-push-data.json"
    with open(tmp_file, "w") as f:
        json.dump(data, f)

    result = subprocess.run(
        ["gh", "api", "--method", "PUT",
         f"repos/{REPO}/contents/{filepath}",
         "--input", tmp_file],
        capture_output=True, text=True
    )

    if result.returncode == 0:
        return True, "OK"
    else:
        return False, result.stderr[:200] or result.stdout[:200]


def main():
    if len(sys.argv) > 1:
        files = sys.argv[1:]
    else:
        files = get_changed_files()

    if not files:
        print("No files to push.")
        return

    print(f"📤 Pushing {len(files)} file(s) to {REPO}...")
    success_count = 0

    for filepath in files:
        ok, msg = push_file(filepath, COMMIT_MSG)
        icon = "✅" if ok else "❌"
        print(f"  {icon} {filepath}: {msg}")
        if ok:
            success_count += 1

    print(f"\n{'✅' if success_count == len(files) else '⚠️'} {success_count}/{len(files)} files pushed successfully.")
    if success_count < len(files):
        sys.exit(1)


if __name__ == "__main__":
    main()
