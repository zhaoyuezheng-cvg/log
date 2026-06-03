---
# 基本信息
title: "{{ replace .Name "-" " " | title }}"  # 自动用文件名生成标题
date: {{ .Date }}                            # 创建日期
lastmod: {{ .Date }}                         # 最后修改日期
draft: true                                  # 默认草稿

author: ""                                   # 作者，可填写

# 分类和标签
categories: []                               # 文章分类
tags: []                                     # 文章标签

# SEO 信息
summary: ""                                  # 摘要，用于首页列表和 meta
description: ""                              # 描述，用于 SEO

# 自定义 URL
slug: ""                                     # 可设置自定义 URL

# 封面和 OG 图片
cover:
  image: ""                                  # 封面图片 URL
  alt: ""                                    # 图片 alt
  caption: ""                                # 图片说明
images: []                                   # OG 图片列表，可用于分享

# 文章目录
ShowToc: true                                # 是否显示目录
TocOpen: false                               # 目录默认是否展开

# 评论系统
comments: true                               # 是否开启评论（PaperMod 支持 Disqus/Utterances）

# 排序权重（可用于手动排序文章）
weight: 0
---
## 正文开始

在这里开始撰写文章内容。