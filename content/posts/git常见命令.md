---
categories:
- 技术
- 工具
date: '2026-05-28T10:40:36+08:00'
description: Git常见命令
draft: false
tags:
- Hugo
- VSCode
- Git
title: Git常见命令
---

---

## 一、初始化 & 克隆（第一次用）
```bash
# 1. 本地新建 git 仓库
git init

# 2. 克隆远程仓库到本地（最常用）
git clone https://github.com/xxx/xxx.git

# 3. 查看远程仓库地址
git remote -v

# 4. 添加远程仓库（本地关联远程）
git remote add origin 仓库地址
```

---

## 二、日常提交（改代码→上传本地）
```bash
# 1. 查看状态（哪些文件改了、新增了）
git status

# 2. 把所有修改加入暂存区（最常用）
git add .

# 3. 提交到本地仓库，带说明（必须写清楚）
git commit -m "feat: 新增文章/修复bug"

# 4. 快捷：已跟踪文件直接提交（跳过 add）
git commit -am "fix: 修复首页样式"
```

---

## 三、同步远程（本地 ↔ GitHub）
```bash
# 1. 拉取远程最新代码（避免冲突，必做）
git pull origin main

# 2. 推送本地到远程（第一次要 -u）
git push -u origin main

# 之后直接
git push

# 3. 强制推送（覆盖远程，谨慎！）
git push --force
```

---

## 四、分支管理（多人协作/多版本）
```bash
# 查看本地分支
git branch

# 查看本地+远程所有分支
git branch -a

# 创建分支
git branch dev

# 切换分支（旧版）
git checkout dev

# 创建并切换（推荐）
git checkout -b dev
# 新版更直观
git switch -c dev

# 合并 dev 到 main
git checkout main
git merge dev

# 删除本地分支
git branch -d dev

# 删除远程分支
git push origin --delete dev
```

---

## 五、查看日志 & 对比
```bash
# 完整提交日志
git log

# 简洁版（一行一个，推荐）
git log --oneline

# 最近 n 条
git log --oneline -5

# 看具体文件改动
git diff 文件名

# 看暂存区和仓库差异
git diff --staged
```

---

## 六、撤销 & 回退（改错了怎么办）
```bash
# 1. 撤销工作区修改（未 add）
git restore 文件名

# 2. 撤销暂存（add 了但没 commit）
git restore --staged 文件名

# 3. 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 4. 彻底回退（危险！丢代码）
git reset --hard HEAD~1

# 5. 安全撤销某次提交（生成新提交，不改历史）
git revert 提交id
```

---

## 七、标签（版本发布用）
```bash
# 打标签
git tag v1.0

# 推送标签到远程
git push origin v1.0

# 删除本地标签
git tag -d v1.0

# 删除远程标签
git push origin --delete v1.0
```

---

## 八、日常工作流（你用 Hugo/GitHub Pages）
```bash
# 写新文章后
hugo --minify

git add .
git commit -m "新增文章：xxx"
git pull origin main   # 先拉，避免冲突
git push
```