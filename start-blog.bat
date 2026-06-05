@echo off
echo ============================================
echo           Hugo Blog - 启动脚本
echo ============================================
echo.
echo 项目目录: d:\hugo\blog
echo 功能: 本地预览 Hugo 博客网站
echo.

cd /d "d:\hugo\blog"

echo 正在启动 Hugo 开发服务器...
echo 访问地址: http://localhost:1313
echo.
..\bin\hugo.exe server -D