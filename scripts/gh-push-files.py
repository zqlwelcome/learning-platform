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
from pathlib import Path

REPO = os.environ.get("REPO", "zqlwelcome/learning-platform")
REPO_DIR = os.environ.get("LEARNING_PLATFORM_DIR", "/tmp/learning-platform")
COMMIT_MSG = os.environ.get("COMMIT_MSG", f"auto: 数据更新 via gh-push-files.py")
STATE_FILE = Path(REPO_DIR) / ".remote-sync-state.json"


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


def get_remote_head_sha():
    """Get latest GitHub main SHA."""
    result = subprocess.run(
        ["gh", "api", f"repos/{REPO}/branches/main", "--jq", ".commit.sha"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return None
    return result.stdout.strip()


def ensure_remote_sync_guard():
    """Refuse pushes if local files were not synced from latest GitHub main."""
    if os.environ.get("SKIP_REMOTE_SYNC_GUARD") == "1":
        print("⚠️  SKIP_REMOTE_SYNC_GUARD=1, bypassing remote freshness check.")
        return

    remote_head = get_remote_head_sha()
    if not remote_head:
        print("❌ Could not read GitHub main SHA. Aborting to avoid overwriting remote work.")
        sys.exit(3)

    if not STATE_FILE.exists():
        print("❌ Missing .remote-sync-state.json.")
        print("Run: python3 scripts/sync-remote-before-work.py")
        sys.exit(3)


def update_remote_sync_state(files):
    """Refresh sync state after a successful API push."""
    remote_head = get_remote_head_sha()
    if not remote_head:
        return
    state = {
        "repo": REPO,
        "remote_head": remote_head,
        "synced_at": subprocess.run(
            ["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"],
            capture_output=True,
            text=True,
        ).stdout.strip(),
        "files": files,
    }
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    try:
        state = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"❌ Could not read .remote-sync-state.json: {exc}")
        sys.exit(3)

    synced_head = state.get("remote_head")
    if state.get("repo") != REPO or synced_head != remote_head:
        print("❌ Remote changed after the last local sync. Aborting push.")
        print(f"   synced: {str(synced_head)[:7]}")
        print(f"   remote: {remote_head[:7]}")
        print("Run: python3 scripts/sync-remote-before-work.py")
        sys.exit(3)


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

    ensure_remote_sync_guard()

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
    update_remote_sync_state(files)


if __name__ == "__main__":
    main()
