+++
date = '2026-05-28T10:36:40+08:00'
draft = false
title = 'Hugo常见命令'
description = "hugo常见命令"
categories = ["技术","工具" ]   # 大分类：技术/工具/生活/学习/博客
tags = ["Hugo"] # 自定义标签
+++

一份精简、实用的 Hugo 命令速查。

---

## 一、项目创建 & 初始化
```bash
# 1. 新建站点（在当前目录下创建 myblog 文件夹）
hugo new site myblog

# 2. 进入项目目录
cd myblog

# 3. 初始化主题模块（新版 Hugo 推荐）
hugo mod init github.com/你的用户名/你的仓库名
```

---

## 二、写文章（最常用）
```bash
# 新建一篇文章（自动生成 frontmatter，draft=true 草稿）
hugo new posts/第一篇文章.md

# 新建页面（如 about、contact）
hugo new about.md
```

---

## 三、本地预览（开发）
```bash
# 启动本地服务器，默认 http://localhost:1313，热更新
hugo server

# 🔥 常用：预览包含草稿（draft=true）的文章
hugo server -D

# 自定义端口（如 8080）
hugo server --port 8080

# 绑定到所有网卡（手机/局域网访问）
hugo server --bind 0.0.0.0
```

---

## 四、构建发布（生产）
```bash
# 构建静态文件到 public/（默认，不含草稿）
hugo

# 🔥 生产环境压缩（HTML/CSS/JS 最小化，推荐）
hugo --minify

# 构建并包含草稿（临时用）
hugo -D

# 指定输出目录（默认 public）
hugo -d ./dist
```

---

## 五、日常工作流（你用 GitHub Pages）
```bash
# 1. 写新文章
hugo new posts/xxx.md

# 2. 本地预览
hugo server -D

# 3. 确认后，把草稿改为正式：把 md 文件里 draft = false

# 4. 构建生产文件
hugo --minify

# 5. 提交到 Git 并推送
git add .
git commit -m "发表新文章"
git push
```

---

## 六、模块 & 主题管理（常用）
```bash
# 拉取主题/模块更新
hugo mod get -u

# 清理模块缓存（解决依赖报错）
hugo mod clean --all

# 整理 go.mod（删除无用依赖）
hugo mod tidy
```

---

## 七、排错 & 信息
```bash
# 查看版本
hugo version

# 查看帮助
hugo help
hugo server --help

# 列出所有草稿
hugo list drafts

# 清空 public 再构建（避免旧文件残留）
rm -rf public && hugo --minify
```

---

## 八、常用参数速查表
- `-D / --buildDrafts`：包含草稿
- `--minify`：压缩代码（生产必加）
- `--port 端口`：自定义端口
- `-v`：详细日志（排错用）

---
