+++
title= "「错题宝」—— 初中生智能错题管理App 详细方案（mimo版）"
date=2026-05-29T12:00:00+08:00
draft= false
tags= ["技术", "方案生成", "豆包", "mimo"]
categories = ["技术","工具" ]  
+++


# 「错题宝」—— 初中生智能错题管理App 详细方案

---

## 一、项目总览

### 1.1 项目定位

一款面向初中生的**错题管理 + AI 辅助学习**工具，覆盖语文、英语、数学及小四门（历史、地理、生物、道德与法治），核心目标：**记录 → 理解 → 巩固 → 提分**。

### 1.2 核心用户画像

| 角色 | 使用场景 |
|------|----------|
| 学生（儿子） | 日常记录错题、查看复习、与AI互动 |
| 家长（你） | 后台管理、查看学习数据、补充内容 |

### 1.3 整体功能矩阵

```
┌─────────────────────────────────────────────────────┐
│                    错题宝 App                        │
├──────────┬──────────┬──────────┬─────────────────────┤
│   语文   │   英语   │   数学   │    小四门(4科)      │
├──────────┼──────────┼──────────┼─────────────────────┤
│ 字词读音  │ 错词本   │ 错题录入  │    拍照录入         │
│ 混淆字词  │ 易错短语  │ 解法记录  │    答案整理         │
│ 文学常识  │ 句型归纳  │ AI解题   │    AI整理答案       │
│ 古文基础  │ 错题集   │ 拍照识别  │    拍照识别         │
│ 拍照输入  │ 语音输入  │          │                     │
│ AI矫正   │ AI扩展   │          │                     │
├──────────┴──────────┴──────────┴─────────────────────┤
│          通用能力：拍照OCR / 语音STT / AI对话          │
│          学习管理：艾宾浩斯复习 / 统计分析 / 搜索       │
│          后台管理：内容管理 / 用户管理 / 数据统计        │
└─────────────────────────────────────────────────────┘
```

---

## 二、技术架构方案

### 2.1 推荐技术栈

> 考虑到你是个人开发者、买了云服务器、孩子用手机，推荐**最务实**的方案：

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| **前端（移动端）** | Flutter（推荐）或 uni-app | 一套代码同时出 Android + iOS；uni-app 如果你更熟悉 Vue |
| **后端服务** | Python + FastAPI | 生态好、AI库丰富、异步性能强、开发快 |
| **数据库** | MySQL 8.0 + Redis | MySQL 存业务数据，Redis 做缓存和复习提醒队列 |
| **文件存储** | 阿里云OSS / 本地存储 | 存储拍照图片、音频文件 |
| **AI能力** | 通义千问API / DeepSeek API | 国内稳定、中文能力强、价格便宜 |
| **OCR识别** | 百度OCR API / 通义千问视觉模型 | 拍照识别文字 |
| **语音识别** | 讯飞语音 / 阿里云语音 | 中英文语音转文字 |
| **后台管理** | Vue3 + Element Plus | 功能完善的管理后台 |
| **服务器** | 你的云服务器（推荐2核4G起步） | 个人使用足够 |

### 2.2 系统架构图

```
                    ┌──────────────┐
                    │   手机App    │
                    │  (Flutter)   │
                    └──────┬───────┘
                           │ HTTPS
                    ┌──────▼───────┐
                    │   Nginx      │  反向代理 + 静态资源
                    │   80/443     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼────┐ ┌────▼─────┐
       │ FastAPI后端  │ │ Vue3  │ │ WebSocket│
       │  (业务API)   │ │管理后台│ │ (实时推送) │
       │  :8000       │ │ :3000 │ │  :8001   │
       └──────┬──────┘ └──┬────┘ └────┬─────┘
              │            │           │
       ┌──────▼────────────▼───────────▼─────┐
       │           MySQL + Redis              │
       │         数据持久化 + 缓存             │
       └──────────────┬──────────────────────┘
                      │
       ┌──────────────┼──────────────────┐
       │              │                  │
  ┌────▼────┐   ┌─────▼─────┐   ┌───────▼──────┐
  │ AI API  │   │  OCR API  │   │  语音 API    │
  │通义/DeepSeek│ │ 百度OCR   │   │  讯飞/阿里   │
  └─────────┘   └───────────┘   └──────────────┘
```

### 2.3 目录结构

```
cuoti-bao/
├── backend/                    # Python FastAPI 后端
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # 应用入口
│   │   ├── config.py           # 配置文件
│   │   ├── database.py         # 数据库连接
│   │   ├── models/             # 数据模型
│   │   │   ├── user.py
│   │   │   ├── chinese.py
│   │   │   ├── english.py
│   │   │   ├── math.py
│   │   │   ├── general.py      # 小四门
│   │   │   └── review.py       # 复习计划
│   │   ├── api/                # API路由
│   │   │   ├── auth.py
│   │   │   ├── chinese.py
│   │   │   ├── english.py
│   │   │   ├── math.py
│   │   │   ├── general.py
│   │   │   ├── ai_chat.py
│   │   │   ├── ocr.py
│   │   │   ├── voice.py
│   │   │   └── stats.py
│   │   ├── services/           # 业务逻辑
│   │   │   ├── ai_service.py
│   │   │   ├── ocr_service.py
│   │   │   ├── voice_service.py
│   │   │   └── review_service.py
│   │   └── schemas/            # Pydantic数据校验
│   ├── requirements.txt
│   └── Dockerfile
│
├── admin/                      # Vue3 管理后台
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   └── api/
│   └── package.json
│
├── mobile/                     # Flutter 移动端
│   ├── lib/
│   │   ├── pages/
│   │   ├── widgets/
│   │   ├── services/
│   │   └── models/
│   └── pubspec.yaml
│
└── deploy/                     # 部署脚本
    ├── docker-compose.yml
    └── nginx.conf
```

---

## 三、数据库设计

### 3.1 核心数据模型

```sql
-- ============================================
-- 用户表
-- ============================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    nickname VARCHAR(50),
    grade VARCHAR(20) DEFAULT '初一',
    avatar_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 学科表
-- ============================================
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,          -- '语文','英语','数学','历史','地理','生物','道法'
    category ENUM('main', 'minor') DEFAULT 'main',  -- 主科/小四门
    icon VARCHAR(50),
    sort_order INT DEFAULT 0
);

-- ============================================
-- 错题/知识点总表（统一入口）
-- ============================================
CREATE TABLE error_entries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subject_id INT NOT NULL,
    entry_type VARCHAR(30) NOT NULL,    -- 细分类型，见下方枚举
    title VARCHAR(200),                 -- 标题/摘要
    content TEXT,                       -- 主要内容
    answer TEXT,                        -- 正确答案/解析
    source VARCHAR(50),                 -- 来源：'期中考试','课后练习','课堂听写'
    difficulty TINYINT DEFAULT 3,       -- 1-5难度
    importance TINYINT DEFAULT 3,       -- 1-5重要度
    photo_urls JSON,                    -- 拍照图片URL列表
    ai_analysis TEXT,                   -- AI分析内容
    is_mastered BOOLEAN DEFAULT FALSE,  -- 是否已掌握
    mastered_at DATETIME,
    review_count INT DEFAULT 0,         -- 复习次数
    next_review_at DATETIME,            -- 下次复习时间（艾宾浩斯）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    INDEX idx_user_subject (user_id, subject_id),
    INDEX idx_next_review (user_id, next_review_at),
    INDEX idx_entry_type (subject_id, entry_type)
);

-- entry_type 枚举说明：
-- 语文: 'pronunciation'(字词读音), 'confusing_words'(混淆字词),
--        'literature'(文学常识), 'classical_chinese'(古文基础), 'reading'(阅读理解)
-- 英语: 'vocabulary'(单词), 'phrase'(短语), 'sentence_pattern'(句型), 'error_question'(错题)
-- 数学: 'error_question'(错题), 'concept'(概念题)
-- 小四门: 'error_question'(错题), 'knowledge_point'(知识点)

-- ============================================
-- 标签表（多维度分类检索）
-- ============================================
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    subject_id INT,
    color VARCHAR(20) DEFAULT '#4A90D9',
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE entry_tags (
    entry_id BIGINT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (entry_id, tag_id),
    FOREIGN KEY (entry_id) REFERENCES error_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ============================================
-- AI对话记录表
-- ============================================
CREATE TABLE ai_conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    entry_id BIGINT,                    -- 关联的错题（可为空）
    subject_id INT,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (entry_id) REFERENCES error_entries(id) ON DELETE SET NULL,
    INDEX idx_user_entry (user_id, entry_id)
);

-- ============================================
-- 复习计划表（艾宾浩斯遗忘曲线）
-- ============================================
CREATE TABLE review_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    entry_id BIGINT NOT NULL,
    review_stage TINYINT DEFAULT 0,     -- 0-7 对应 8次复习
    scheduled_at DATETIME NOT NULL,     -- 计划复习时间
    completed_at DATETIME,              -- 实际完成时间
    result ENUM('forgot', 'vague', 'remembered'),  -- 复习结果
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (entry_id) REFERENCES error_entries(id) ON DELETE CASCADE,
    INDEX idx_user_schedule (user_id, scheduled_at)
);

-- ============================================
-- 学习统计表（每日汇总）
-- ============================================
CREATE TABLE daily_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    stat_date DATE NOT NULL,
    subject_id INT,
    new_entries INT DEFAULT 0,          -- 新增条目数
    reviewed_entries INT DEFAULT 0,     -- 复习条目数
    mastered_entries INT DEFAULT 0,     -- 掌握条目数
    ai_queries INT DEFAULT 0,          -- AI查询次数
    study_minutes INT DEFAULT 0,       -- 学习时长(分钟)
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY uk_user_date_subject (user_id, stat_date, subject_id)
);
```

### 3.2 数据库 ER 关系图

```
users ──────┬──────────────┐
            │              │
    error_entries ──── entry_tags ──── tags
            │
    ┌───────┼────────┐
    │       │        │
ai_conv  review_schedule  daily_stats
```

---

## 四、功能模块详细设计

### 4.1 语文模块

#### 4.1.1 字词读音纠错

```
┌─────────────────────────────────────────────────┐
│  📝 记录页面                                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  错误字词：  [ 膝  盖    ]                        │
│  错误读音：  [ qī gài   ]  🎤 语音输入            │
│  正确读音：  [ xī gài   ]                        │
│  出错场景：  [ 课堂听写 ▼]                        │
│  拍照记录：  [📷 拍照/从相册选择]                   │
│                                                  │
│  ── AI 智能扩展 ──────────────────               │
│  [🤖 点击获取AI讲解]                              │
│                                                  │
│  AI回复示例：                                     │
│  「膝」读 xī，易错读 qī。同类型的还有：             │
│   · 畸形(jī 不读 qí)                             │
│   · 发酵(jiào 不读 xiào)                         │
│   · 粗犷(guǎng 不读 kuàng)                       │
│   记忆技巧：月字旁的字多与身体有关...               │
│                                                  │
│  标签：[易错读音] [月字旁] [+添加标签]              │
│                                                  │
│           [ 保  存 ]                              │
└─────────────────────────────────────────────────┘
```

#### 4.1.2 混淆字词

```
┌─────────────────────────────────────────────────┐
│  混淆字词记录                                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  易混词组：  「的 / 地 / 得」                      │
│  造句错误：  "他高兴的跑了" ← 应为"地"              │
│  辨析规则：  [记录区分方法...]                      │
│  拍照记录：  [📷]                                  │
│                                                  │
│  [🤖 AI 辨析扩展]                                 │
│  → AI 生成更多例句、对比表格、记忆口诀              │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 4.1.3 文学常识 & 古文基础

```
┌─────────────────────────────────────────────────┐
│  文学常识 / 古文基础                                │
├─────────────────────────────────────────────────┤
│                                                  │
│  分类选择：[文学常识 ▼] [古文基础 ▼]               │
│                                                  │
│  知识点：  《岳阳楼记》作者及背景                    │
│  内容：    [范文希，字希文，北宋政治家...]           │
│  关联课文：《岳阳楼记》八年级下册                    │
│  拍照：    [📷 拍摄课堂笔记/课本]                   │
│                                                  │
│  [🤖 AI 延伸讲解]                                 │
│  → 作者生平、写作背景、同类作品对比                 │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 4.1.4 拍照输入流程

```
拍照/选图 → OCR识别文字 → 自动填充表单 → 人工校对 → AI分析 → 保存
                ↓
         支持：课本截图、手写笔记、试卷错题
```

---

### 4.2 英语模块

#### 4.2.1 易错单词本

```
┌─────────────────────────────────────────────────┐
│  英语单词记录                                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  单词：    [ beautiful    ]                       │
│  错误拼写：[ beutiful     ]  🎤 语音输入           │
│  音标：    [ /ˈjuːtɪfl/  ]  ← AI自动补全          │
│  词性：    [ adj.         ]                       │
│  中文释义：[ 美丽的        ]                       │
│  出错场景：[ 单元测试 ▼]                           │
│  拍照：    [📷]                                   │
│                                                  │
│  [🤖 AI 扩展]                                    │
│  → 常见拼写错误模式、同根词、派生词、                │
│    记忆方法、例句、考试频率                         │
│                                                  │
│  ── AI 示例回复 ──                                │
│  「beautiful」常见错误：                           │
│   1. 漏掉 a → beutiful ✗                         │
│   2. 记忆法：beau(美) + ti + ful(充满)            │
│   3. 同根词：beauty, beautifully, beautify        │
│   4. 考频：中考高频词 ⭐⭐⭐⭐⭐                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 4.2.2 易错短语 & 句型

```
┌─────────────────────────────────────────────────┐
│  短语/句型记录                                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  类型：[短语 ▼] [句型 ▼]                          │
│                                                  │
│  错误表达：  "I very like English"                 │
│  正确表达：  "I like English very much"            │
│  错误原因：  中式英语，副词位置不对                  │
│  拍照记录：  [📷]                                  │
│                                                  │
│  [🤖 AI 扩展]                                    │
│  → 同类错误句型、正确结构归纳、                     │
│    类似易错短语、考试例题                           │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 4.2.3 英语错题集

```
┌─────────────────────────────────────────────────┐
│  英语错题                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  [📷 拍照录入整道题]                               │
│                                                  │
│  题目：    [OCR自动识别/手动输入]                   │
│  我的答案：[ B ]                                  │
│  正确答案：[ C ]                                  │
│  知识点：  [ 宾语从句语序 ]                        │
│  拍照解法：[📷]                                   │
│                                                  │
│  [🤖 AI 详细解析]                                 │
│  [🤖 生成同类练习题]                               │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 4.2.4 语音识别输入

```
┌──────────────────────────────────────────────┐
│  语音输入流程                                   │
│                                               │
│  [🎤 按住说话] → 语音转文字 → 填入对应输入框     │
│                                               │
│  支持场景：                                     │
│  · 读出单词，自动识别拼写                        │
│  · 读出句子，自动转写                            │
│  · 听写后语音复查                                │
│                                               │
│  中英文混合识别，自动判断语种                     │
└──────────────────────────────────────────────┘
```

---

### 4.3 数学模块

#### 4.3.1 错题录入与AI解题

```
┌─────────────────────────────────────────────────┐
│  数学错题                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  章节：[一元一次方程 ▼]  来源：[月考 ▼]            │
│                                                  │
│  [📷 拍照题目]  →  OCR识别                        │
│                                                  │
│  题目：已知 3x + 5 = 2x - 1，求x的值              │
│                                                  │
│  我的错误解法：                                    │
│  [📷 拍照/手动输入]                               │
│  3x + 5 = 2x - 1                                │
│  3x + 2x = -1 - 5  ← 移项符号错误                │
│  5x = -6                                        │
│  x = -6/5                                       │
│                                                  │
│  正确解法：                                       │
│  [📷 拍照/手动输入]                               │
│                                                  │
│  [🤖 AI 详细讲解]                                │
│                                                  │
│  ── AI 回复 ──                                   │
│  📍 错误分析：移项时符号未变号                      │
│  📍 正确步骤：                                    │
│     3x + 5 = 2x - 1                             │
│     3x - 2x = -1 - 5  ✓                         │
│     x = -6                                      │
│  📍 要点：移项必变号，这是方程的核心规则             │
│  📍 类似练习：                                    │
│     ① 5x - 3 = 3x + 7                           │
│     ② 4x + 2 = 2x - 8                           │
│                                                  │
│  [🤖 再出3道类似题]  [🤖 换个方式讲解]             │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

### 4.4 小四门模块

#### 4.4.1 统一错题录入

```
┌─────────────────────────────────────────────────┐
│  小四门错题  [历史 ▼] [地理 ▼] [生物 ▼] [道法 ▼]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  [📷 拍照录入]                                    │
│                                                  │
│  题目：[OCR识别/手动输入]                          │
│  我的答案：[ ]                                    │
│  正确答案：[ ]                                    │
│  拍照答案：[📷]                                   │
│                                                  │
│  [🤖 AI 整理标准答案]                             │
│  [🤖 AI 归纳知识点]                               │
│                                                  │
│  ── AI 回复（历史示例）──                          │
│  📍 答案：B. 鸦片战争（1840-1842）                 │
│  📍 知识点：中国近代史开端                          │
│  📍 关联：《南京条约》—中国第一个不平等条约          │
│  📍 记忆：时间轴 1840→鸦片战争→近代史开端           │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

### 4.5 通用能力模块

#### 4.5.1 艾宾浩斯智能复习

```
复习间隔（艾宾浩斯遗忘曲线）：
┌────────────────────────────────────────────┐
│  第1次复习：1天后                             │
│  第2次复习：2天后                             │
│  第3次复习：4天后                             │
│  第4次复习：7天后                             │
│  第5次复习：15天后                            │
│  第6次复习：30天后                            │
│  第7次复习：60天后  (可选)                    │
└────────────────────────────────────────────┘

复习页面：
┌────────────────────────────────────────────┐
│  📅 今日待复习：12条                         │
│                                            │
│  语文(4)  英语(5)  数学(2)  历史(1)          │
│                                            │
│  ┌──────────────────────────┐              │
│  │ 膝盖(qī gài) → xī gài   │              │
│  │                          │              │
│  │  记住了？                 │              │
│  │  [😰 忘了] [😐 模糊] [😊 记住]  │        │
│  └──────────────────────────┘              │
│                                            │
│  记住→进入下一复习阶段                       │
│  忘了→重置到第1阶段重新开始                   │
│  模糊→维持当前阶段                           │
└────────────────────────────────────────────┘
```

#### 4.5.2 首页仪表盘

```
┌─────────────────────────────────────────────────┐
│  早上好，同学 👋              📅 2025.05.29       │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──── 今日待复习 ────┐  ┌──── 待掌握 ──────┐   │
│  │     12 条          │  │     86 条         │   │
│  └────────────────────┘  └──────────────────┘   │
│                                                  │
│  ── 各科错题统计 ──                               │
│  语文 ████████░░ 45条  [进入]                     │
│  英语 ██████████ 52条  [进入]                     │
│  数学 █████░░░░░ 28条  [进入]                     │
│  历史 ██░░░░░░░░ 12条  [进入]                     │
│  地理 ███░░░░░░░ 15条  [进入]                     │
│  生物 ██░░░░░░░░ 10条  [进入]                     │
│  道法 █░░░░░░░░░  8条  [进入]                     │
│                                                  │
│  ── 本周学习曲线 ──                               │
│  [折线图：新增/复习/掌握趋势]                      │
│                                                  │
│  ── 快捷操作 ──                                  │
│  [📷 拍照录入] [🎤 语音输入] [🤖 AI问答]          │
│                                                  │
└─────────────────────────────────────────────────┘

底部导航：[首页] [录入] [复习] [搜索] [我的]
```

#### 4.5.3 全局搜索

```
支持：
· 关键词搜索所有错题/知识点
· 按学科筛选
· 按标签筛选
· 按时间范围筛选
· 按掌握状态筛选
· 按难度/重要度筛选
```

---

### 4.6 后台管理系统

```
┌─────────────────────────────────────────────────────────────┐
│  错题宝 · 管理后台                                           │
├───────────┬─────────────────────────────────────────────────┤
│  侧边栏    │  内容区域                                        │
│           │                                                 │
│  📊 数据概览│  各科错题统计图表                                 │
│           │  学习时长统计                                     │
│  📚 语文管理│  复习完成率                                      │
│  📖 英语管理│                                                 │
│  📐 数学管理│                                                 │
│  📋 小四门  │                                                 │
│           │  表格化管理所有错题/知识点                          │
│  🏷️ 标签  │  支持增删改查、批量导入                            │
│           │  支持手动补充AI分析内容                             │
│  🤖 AI管理 │                                                 │
│           │  AI接口配置                                        │
│  👤 用户   │  AI用量统计                                       │
│           │                                                 │
│  ⚙️ 系统  │  系统设置、备份、日志                              │
└───────────┴─────────────────────────────────────────────────┘
```

#### 后台管理功能清单

| 模块 | 功能 |
|------|------|
| 数据概览 | 错题总数/各科分布、学习天数、复习完成率、AI使用量、趋势图表 |
| 内容管理 | 各科错题CRUD、批量导入/导出、Excel导入、手动补充解析 |
| 标签管理 | 创建/编辑/删除标签、批量打标签 |
| 复习管理 | 查看复习计划、手动调整复习安排、复习统计 |
| AI配置 | API Key设置、Prompt模板管理、用量监控 |
| 数据统计 | 按学科/时间/知识点维度统计分析、薄弱知识点排行 |
| 系统管理 | 用户管理、数据备份/恢复、操作日志 |

---

## 五、AI 集成方案

### 5.1 AI 服务架构

```python
# app/services/ai_service.py 核心设计

class AIService:
    """
    AI 服务统一入口
    支持多模型切换（通义千问/DeepSeek/其他）
    """
    
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.AI_API_KEY,
            base_url=settings.AI_BASE_URL  # 兼容 OpenAI 接口的任何模型
        )
    
    # ---- 语文相关 ----
    async def analyze_pronunciation(self, word: str, wrong_pinyin: str) -> str:
        """分析读音错误，扩展同类易错字"""
        prompt = f"""你是一位经验丰富的初中语文老师。
学生将「{word}」错误读成了「{wrong_pinyin}」。
请：
1. 给出正确读音
2. 解释为什么容易读错
3. 列出5个同类型的易错读音
4. 提供记忆技巧
5. 用一个包含该字的成语或诗句加深印象"""

    async def analyze_confusing_words(self, words: list, context: str) -> str:
        """分析混淆字词，提供辨析"""

    async def explain_literature(self, topic: str) -> str:
        """文学常识/古文讲解"""

    # ---- 英语相关 ----
    async def analyze_vocabulary(self, word: str, error: str) -> str:
        """分析英语单词错误，扩展记忆"""

    async def analyze_sentence(self, wrong: str, correct: str) -> str:
        """分析句型/短语错误"""

    async def generate_similar_exercises(self, knowledge_point: str, count: int = 3) -> str:
        """根据知识点生成类似练习题"""

    # ---- 数学相关 ----
    async def solve_math_problem(self, problem: str, student_answer: str = None) -> str:
        """数学题详细讲解"""
        prompt = f"""你是一位耐心的初中数学老师。
题目：{problem}
{"学生的错误答案：" + student_answer if student_answer else ""}
请：
1. 分析题目考查的知识点
2. 给出详细的解题步骤
3. 如果学生答错了，指出错误原因
4. 总结解题关键点
5. 列出注意事项和常见陷阱"""

    # ---- 通用 ----
    async def chat(self, messages: list, subject: str = None) -> str:
        """通用对话，可关联具体题目"""

    async def analyze_photo(self, image_base64: str, subject: str) -> dict:
        """图片内容识别与分析（使用视觉模型）"""
```

### 5.2 AI 调用流程

```
用户操作 → 前端请求 → 后端路由 → AI Service → AI API
                                         ↓
                                    记录token用量
                                         ↓
                              结果存入 ai_conversations 表
                                         ↓
                              前端展示 + 可保存为错题笔记
```

### 5.3 Prompt 设计策略

```python
# 系统提示词（按学科）

PROMPTS = {
    "语文": """你是一位资深的初中语文教师，善于用生动有趣的方式讲解语文知识。
要求：
- 语言亲切自然，像在跟学生聊天
- 举的例子贴近初中生生活
- 涉及古文时，提供原文+翻译+赏析
- 知识点关联中考考点
- 适当使用口诀帮助记忆""",

    "英语": """You are an experienced middle school English teacher who is bilingual.
要求：
- 用中英结合的方式讲解
- 每个单词给出音标、词性、例句
- 拼写错误要分析错误规律
- 关联中考词汇大纲
- 提供记忆技巧（词根词缀法、联想法等）""",

    "数学": """你是一位逻辑清晰的初中数学老师。
要求：
- 每道题先分析考查的知识点
- 解题步骤要详细，每一步都说明为什么
- 如果学生做错了，先表扬做对的部分，再指出错误
- 最后总结解题方法和易错点
- 适当提供同类练习题""",

    "小四门": """你是一位博学的初中综合学科老师，擅长帮助学生记忆知识点。
要求：
- 答案简明扼要，重点突出
- 帮助构建知识框架和思维导图
- 提供记忆口诀和联想记忆法
- 关联中考常见考法"""
}
```

### 5.4 推荐的 AI 模型选择

| 模型 | 优势 | 价格 | 推荐度 |
|------|------|------|--------|
| **DeepSeek-V3** | 中文能力强、性价比极高 | 约1元/百万token | ⭐⭐⭐⭐⭐ |
| **通义千问-Max** | 阿里生态、视觉能力强 | 有免费额度 | ⭐⭐⭐⭐ |
| **GLM-4-Flash** | 免费额度大 | 基本免费 | ⭐⭐⭐⭐ |
| **文心一言** | 百度生态、OCR能力强 | 按量计费 | ⭐⭐⭐ |

> 建议：主力用 DeepSeek，备用 通义千问。预算控制在**每月20-50元**以内。

---

## 六、API 接口设计

### 6.1 接口总览

```
基础路径: /api/v1

认证相关:
  POST   /auth/login              # 登录
  POST   /auth/register           # 注册(后台)
  POST   /auth/refresh            # 刷新token

语文模块:
  GET    /chinese/entries         # 获取列表(支持筛选分页)
  POST   /chinese/entries         # 新增
  PUT    /chinese/entries/{id}    # 修改
  DELETE /chinese/entries/{id}    # 删除
  POST   /chinese/entries/{id}/ai-analyze  # AI分析

英语模块:
  GET    /english/entries         # 获取列表
  POST   /english/entries         # 新增
  PUT    /english/entries/{id}    # 修改
  DELETE /english/entries/{id}    # 删除
  POST   /english/entries/{id}/ai-analyze  # AI分析
  POST   /english/entries/{id}/ai-exercise # AI生成练习

数学模块:
  GET    /math/entries            # 获取列表
  POST   /math/entries            # 新增
  PUT    /math/entries/{id}       # 修改
  DELETE /math/entries/{id}       # 删除
  POST   /math/entries/{id}/ai-solve      # AI解题

小四门:
  GET    /general/entries         # 获取列表(按学科筛选)
  POST   /general/entries         # 新增
  PUT    /general/entries/{id}    # 修改
  DELETE /general/entries/{id}    # 删除
  POST   /general/entries/{id}/ai-organize # AI整理

通用功能:
  POST   /upload/image            # 上传图片
  POST   /ocr/recognize           # OCR识别
  POST   /voice/transcribe        # 语音转文字
  POST   /ai/chat                 # AI通用对话
  GET    /ai/history              # AI对话历史

复习系统:
  GET    /review/today            # 今日待复习
  POST   /review/{id}/complete    # 完成复习
  GET    /review/schedule         # 复习日历

统计分析:
  GET    /stats/overview          # 总览数据
  GET    /stats/trend             # 趋势图表
  GET    /stats/weak-points       # 薄弱知识点
  GET    /stats/subject/{id}      # 各科详细统计

搜索:
  GET    /search?q=&subject=&tag= # 全局搜索
```

### 6.2 请求/响应示例

```json
// POST /api/v1/chinese/entries
// 请求
{
    "subject_id": 1,
    "entry_type": "pronunciation",
    "title": "膝盖读音",
    "content": "膝盖",
    "answer": "xī gài（不是qī gài）",
    "source": "课堂听写",
    "difficulty": 3,
    "importance": 4,
    "photo_urls": ["https://oss.xxx.com/img/001.jpg"],
    "tags": ["易错读音", "月字旁"]
}

// 响应
{
    "code": 200,
    "data": {
        "id": 1001,
        "title": "膝盖读音",
        "created_at": "2025-05-29T10:30:00",
        "next_review_at": "2025-05-30T08:00:00"
    }
}
```

---

## 七、开发计划

### 7.1 分阶段实施（建议 6-8 周完成 MVP）

```
Phase 1 — 基础框架（第1-2周）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ 搭建 FastAPI 后端项目
✦ 数据库设计 + 建表
✦ 用户认证（JWT）
✦ 基础 CRUD 接口（各科错题）
✦ Flutter 项目初始化
✦ 登录页面 + 首页框架

Phase 2 — 核心录入功能（第3-4周）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ 各科错题录入页面（语文/英语/数学/小四门）
✦ 图片上传 + OCR识别
✦ 语音输入集成
✦ 标签系统
✦ 后台管理基础页面

Phase 3 — AI 集成（第5-6周）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ AI 服务接入（DeepSeek）
✦ 语文AI分析（读音/混淆词/文学常识）
✦ 英语AI扩展（单词/短语/句型）
✦ 数学AI解题
✦ 小四门AI整理
✦ 对话历史记录

Phase 4 — 复习 & 统计（第7周）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ 艾宾浩斯复习系统
✦ 复习提醒（本地通知）
✦ 学习统计图表
✦ 全局搜索
✦ 后台管理完善

Phase 5 — 优化上线（第8周）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ UI美化 + 动画
✦ 性能优化
✦ 数据备份方案
✦ 打包部署
✦ 使用培训（教孩子用）
```

### 7.2 每日开发建议

> 如果你每天能投入 **2-3小时**，按以上节奏可以完成。如果你开发经验不多，建议：
>
> - 第一个2周只搭后端，用 Postman 测试接口
> - 第3-4周再开始写 App 前端
> - AI部分先用最简单的接入，后续再优化 prompt

---

## 八、部署方案

### 8.1 Docker Compose 一键部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 后端 API
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql+pymysql://cuoti:password@db:3306/cuoti_bao
      - REDIS_URL=redis://redis:6379/0
      - AI_API_KEY=your-api-key-here
      - AI_BASE_URL=https://api.deepseek.com
      - OSS_ENDPOINT=your-oss-endpoint
    depends_on:
      - db
      - redis
    restart: always

  # MySQL 数据库
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=cuoti_bao
      - MYSQL_USER=cuoti
      - MYSQL_PASSWORD=password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./deploy/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: always

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: always

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deploy/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./admin/dist:/usr/share/nginx/html/admin  # 管理后台静态文件
    depends_on:
      - backend
    restart: always

volumes:
  mysql_data:
```

### 8.2 Nginx 配置

```nginx
# deploy/nginx.conf
server {
    listen 80;
    server_name your-domain.com;

    # 管理后台
    location /admin {
        alias /usr/share/nginx/html/admin;
        try_files $uri $uri/ /admin/index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # SSE 流式响应支持（AI对话用）
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 120s;
    }

    # 上传文件大小限制
    client_max_body_size 20M;
}
```

### 8.3 服务器要求

| 项目 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 2核 | 2核 |
| 内存 | 2GB | 4GB |
| 硬盘 | 40GB SSD | 60GB SSD |
| 带宽 | 3Mbps | 5Mbps |
| 系统 | Ubuntu 22.04 / CentOS 8 | Ubuntu 22.04 |

---

## 九、成本估算

| 项目 | 费用 | 说明 |
|------|------|------|
| 云服务器 | 已有 | 你已购买 |
| AI API | 20-50元/月 | DeepSeek 价格很低 |
| OCR API | 0-10元/月 | 百度有免费额度 |
| 语音识别 | 0-10元/月 | 阿里云有免费额度 |
| 域名(可选) | 60元/年 | .com 域名 |
| SSL证书 | 免费 | Let's Encrypt |
| **合计** | **约20-70元/月** | 家庭使用非常经济 |

---

## 十、后续可扩展功能

当 MVP 版本运行稳定后，可以逐步添加：

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P1 | 错题组卷 | 从错题库随机抽题生成模拟试卷 |
| P1 | 听写模式 | App 念词语/单词，孩子听写，自动批改 |
| P2 | 学习打卡 | 每日学习打卡、连续打卡统计、奖励机制 |
| P2 | 知识图谱 | 可视化知识点之间的关联 |
| P3 | 多设备同步 | 云端同步，换设备不丢数据 |
| P3 | 家长推送 | 每日学习报告推送到微信（通过微信模板消息） |
| P3 | 课本同步 | 按人教版教材章节归类知识点 |

