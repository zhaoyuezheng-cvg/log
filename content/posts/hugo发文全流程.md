---
categories:
- 技术
- 工具
date: '2026-05-28T08:28:05Z'
description: Hugo发文全流程
draft: false
tags:
- Hugo
- VSCode
- Git
title: Hugo发文全流程
---

Hugo 发文 → 本地预览 → 提交到 GitHub 的完整流程。

---

## 一、基础配置（仅需做一次）
### 1. 本地 Hugo 环境确认
在 `D:\hugo\blog` 目录下打开 PowerShell，执行：
```powershell
# 确认 Hugo 版本
hugo version
# 确认 Git 状态
git status
```
- 看到版本号说明 Hugo 正常
- 看到 `On branch main` 说明 Git 已初始化并关联远程仓库

---

## 二、完整发文流程（日常重复用）
### 步骤 1：新建文章
```powershell
# 新建文章（自动生成 .md 文件，默认 draft=true）
hugo new content/posts/2026-05-28-我的新文章.md
```
文件路径：`content/posts/2026-05-28-我的新文章.md`

### 步骤 2：编辑文章内容
打开 `.md` 文件，做两件事：
1.  写正文（Markdown 格式）
2.  修改文章配置（关键）
    ```markdown
    ---
    title: "我的新文章"       # 文章标题
    date: 2026-05-28T10:00:00+08:00  # 发布日期（建议用当天）
    draft: false            # ✅ 必须改成 false，否则不会被构建
    ---

    这里写正文内容...
    ```

### 步骤 3：本地预览（确保效果正确）
```powershell
# 启动本地服务器，预览文章
hugo server -D
```
- 打开浏览器访问 `http://localhost:1313`
- 检查文章排版、样式、链接是否正常
- 预览无误后，按 `Ctrl + C` 关闭服务器

### 步骤 4：构建静态文件（生产环境）
```powershell
# 构建压缩后的静态文件到 public/ 目录
hugo --minify
```
- 此步骤会自动忽略 `draft=true` 的文章，只构建正式内容
- 生成的 `public/` 目录就是可以直接部署的静态网站

### 步骤 5：提交并推送到 GitHub
```powershell
# 1. 添加所有修改到暂存区
git add .

# 2. 提交修改（写清楚提交说明）
git commit -m "post: 发布《我的新文章》"

# 3. 推送到 GitHub
git push
```
- 如果你配置了 Cloudflare Pages，推送后会自动触发构建，几分钟后网站就会更新

---

## 三、高频场景补充说明
### 场景1：临时预览草稿文章
如果你不想把文章改成 `draft=false`，只想本地预览：
```powershell
# 包含草稿文章的本地预览
hugo server -D
```
⚠️ 注意：生产构建（`hugo --minify`）时，`draft=true` 的文章会被忽略，所以发布前一定要改 `draft=false`。

### 场景2：更新已有文章
```powershell
# 1. 直接修改已有的 .md 文件
# 2. 本地预览
hugo server

# 3. 构建
hugo --minify

# 4. 提交推送
git add .
git commit -m "update: 修改《我的新文章》正文"
git push
```

### 场景3：解决常见报错
1.  **文章不显示**：检查 `draft=false`、`date` 不是未来时间
2.  **构建失败**：检查文章 Markdown 语法，是否有未闭合的标签
3.  **Git 提交报错**：使用 `git commit -m "说明"` 命令行提交，避免 Vim 界面

---

## 四、一键脚本（Windows 专属，懒人必备）
把下面的内容复制到 `D:\hugo\blog` 目录，保存为 `deploy.ps1`：
```powershell
param(
    [string]$message = "update: site content"
)

Write-Host "=== 1. 构建静态文件 ==="
hugo --minify

Write-Host "=== 2. 添加所有修改 ==="
git add .

Write-Host "=== 3. 提交修改 ==="
git commit -m $message

Write-Host "=== 4. 推送到 GitHub ==="
git push

Write-Host "✅ 部署完成！"
```

以后发文只需执行：
```powershell
.\deploy.ps1 -message "post: 发布《我的新文章》"
```
一条命令完成构建、提交、推送全流程。

