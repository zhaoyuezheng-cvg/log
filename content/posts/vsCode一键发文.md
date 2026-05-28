huygo+++
draft = false
title="vs code 一键式发文"
date='2026-05-28T12:00:00Z'
+++

VS Code 配合「GitHub 插件 + Markdown 插件 + 一点配置」完整流程

---

## 一、先把插件配齐（你已有，确认一下）
打开扩展面板 `Ctrl+Shift+X`，确保安装并启用：

### ✅ 必须
1. **GitHub（官方）**  
   用来在左侧直接看到 Git 变更、提交、同步（push/pull）。
2. **Markdown All in One**  
   快捷键加粗/斜体/标题、自动列表、TOC、预览增强。
3. **Markdown Preview Github Styling**（可选但强烈推荐）  
   预览样式和 GitHub 一致，所见即所得。


### ✅ 加分（Hugo 更爽）
- **Hugo Snippets**：一键插入 Hugo 文章头模板（front matter）。
- **PowerShell（微软）**：在 VS Code 里直接跑 Hugo 命令、脚本。

---

## 二、VS Code 内「新建 Hugo 文章」一键模板
不用每次手写 front matter，用**用户代码片段（Snippet）**一键生成：

1. VS Code → `Ctrl+Shift+P` → 输入 `Preferences: Configure User Snippets`  
2. 选 `markdown.json`（全局）或当前工作区  
3. 粘贴下面内容并保存：

```json
{
  "Hugo Post": {
    "prefix": "hugopost",
    "body": [
      "---",
      "title: \"${1:文章标题}\"",
      "date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE"T$CURRENT_HOUR:$CURRENT_MIN:00+08:00"",
      "draft: false",
      "description: \"${2:简介}\"",
      "tags: [\"${3:标签1}\", \"${4:标签2}\"]",
      "categories: [\"${5:分类}\"]",
      "---",
      "",
      "## 一、${6:开头}",
      "",
      "${7:正文内容...}"
    ],
    "description": "Hugo 文章模板"
  }
}
```

**使用：**
- 在 `content/posts/` 新建 `.md`  
- 输入 `hugopost` → 按 `Tab` → 自动生成完整头部+结构。

---

## 三、VS Code 内「写 + 预览」（全程不切浏览器）
1. 新建/打开文章：`content/posts/YYYY-MM-DD-xxx.md`
2. 用 `hugopost` 模板，改标题、日期、标签，**draft: false**
3. 实时预览（两种方式）：
   - 右上角「打开预览」图标
   - 快捷键：`Ctrl+K` → 松开 → `V`（分栏预览）
4. 边写边看，和 GitHub 渲染一致。

---

## 四、VS Code 内「本地跑 Hugo 预览」（不用切终端）
1. 打开「终端」→「新建终端」（PowerShell）
2. 直接在 VS Code 里执行：
   ```powershell
   hugo server -D
   ```
3. 浏览器打开 `http://localhost:1313`，效果和线上一致。
4. 改文章 → 自动刷新，**不用重启服务**。

---

## 五、VS Code 内「提交 + 推送到 GitHub」（完全可视化）
你装的 **GitHub 插件** 就是干这个的，**全程点鼠标，不用敲 git 命令**：

### 1. 左侧「源代码管理」图标（Git）
- 看到所有变更：新文章、修改、图片
- 勾选要提交的文件（一般全选）

### 2. 填写提交信息（例如）
```
post: 发布《2026-05-28 测试文章》
```

### 3. 点「提交」→ 再点「同步更改」（= push）
- 自动推到 GitHub 仓库 main 分支。
- 配合 Cloudflare Pages/GitHub Actions，**推送后自动构建发布**，2–5 分钟线上更新。



---

## 六、终极懒人：VS Code 一键部署按钮（推荐）
不想点两次？把之前的 `deploy.ps1` 集成到 VS Code，**一个按钮完成：构建→提交→推送**。

### 1. 在项目根目录建 `.vscode/tasks.json`
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Hugo 一键发布",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-commitMessage", "post: VSCode 一键发布"
      ],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": []
    }
  ]
}
```

### 2. 触发方式（任选）
- `Ctrl+Shift+P` → 输入 `Tasks: Run Build Task`
- 或在左侧「运行和调试」直接点运行

**效果：**  
自动执行 `hugo --minify` → `git add .` → `git commit` → `git push`，**全程全自动**。

---

## 七、完整流程总结
1. VS Code 打开博客文件夹
2. `content/posts/` 新建 `.md`，输入 `hugopost` 生成模板
3. 写正文，右侧预览；终端 `hugo server` 本地看效果
4. 左侧 Git：填提交信息 → 提交 → 同步（push）
5. 等 2–5 分钟，Cloudflare Pages 自动更新上线

---