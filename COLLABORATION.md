# Codex / Hermes 协作规则

为避免覆盖彼此当天更新，任何本地修改前先执行：

```bash
python3 scripts/sync-remote-before-work.py
```

这个脚本会：
- 显示 GitHub main 最新提交和最近提交记录
- 把关键页面、课程、新闻、数据文件同步到本地
- 写入本地 `.remote-sync-state.json`，供推送脚本判断是否过期

推送统一使用：

```bash
LEARNING_PLATFORM_DIR="/Users/summezhang/Documents/GitHub/learning-platform" \
COMMIT_MSG="你的提交说明" \
python3 scripts/gh-push-files.py 文件1 文件2
```

如果 GitHub main 在同步后又被 Hermes、Codex 或自动任务更新，推送脚本会拒绝执行，并提示重新运行 `sync-remote-before-work.py`。

协作原则：
- 先看最新远端，再开始改
- 只改本次任务相关文件
- 只推本次任务相关文件
- 用户反馈“内容不见了”时，先查 GitHub 最近提交，不用本地旧版本覆盖线上
