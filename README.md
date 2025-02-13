# HandsomeTab - 优雅的新标签页扩展

> 👋 欢迎使用 HandsomeTab！这是一个精心打造的新标签页扩展，希望能为您的浏览体验带来一份优雅与便利。如果您觉得这个项目不错，欢迎给个 Star ⭐️

- 🌐 官网：[https://www.lik.cc](https://www.lik.cc)
- ✨ 在线演示：[https://tab.lik.cc](https://tab.lik.cc)

HandsomeTab 是一个简洁优雅的浏览器新标签页扩展，让你的浏览器更加美观实用。

## 主要特性

- 🎨 精美背景
  - 支持必应每日壁纸
  - 支持动态视频壁纸
  - 支持自定义背景图片
  - 支持本地图片上传

- 🔍 智能搜索
  - 支持多个搜索引擎（Google、百度、必应等）
  - 一键切换搜索引擎
  - 搜索建议功能

- ⌚ 时钟显示
  - 优雅的时间显示
  - 日期信息展示

- 🌤️ 天气预报
  - 实时天气信息
  - 基于位置的天气数据
  - 温度和天气状况展示

- 📰 热点资讯
  - 聚合多个平台热搜
  - 实时更新
  - 一键跳转原文

- 💫 其他功能
  - 每日名言
  - 简洁的设置面板
  - 流畅的动画效果
  - 响应式设计

## 技术栈

- Vue 3
- Vite
- Element Plus
- Pinia
- Vue Router
### Nginx 配置

```nginx
    # LinuxDO API 代理
    location /api/linuxdo/ {
        proxy_pass https://linux.do/;
        proxy_set_header Host linux.do;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Accept 'application/json';
        proxy_set_header User-Agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1.3 TLSv1.2 TLSv1.1 TLSv1;
        rewrite ^/api/linuxdo/(.*) /$1 break;
    }
```
## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── assets/        # 静态资源
├── components/    # 组件
├── services/      # API 服务
├── stores/        # 状态管理
├── utils/         # 工具函数
└── views/         # 页面视图
```

## 使用说明

1. 背景设置
   - 点击右上角设置按钮进入设置面板
   - 可选择随机图片或视频背景
   - 支持上传本地图片或输入图片URL

2. 搜索功能
   - 直接在搜索框输入关键词
   - 点击搜索引擎图标切换不同搜索引擎
   - 支持快捷键操作

3. 天气功能
   - 自动获取当前位置天气信息
   - 显示实时温度和天气状况
   - 点击可查看详细天气信息

4. 热搜功能
   - 自动聚合多平台热搜信息
   - 支持手动刷新
   - 点击直接跳转原文

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 版权声明

本项目采用 [MIT License](LICENSE) 开源协议。

**特别声明：**
1. 在使用本项目代码时，请务必保留作者信息和版权声明。
2. 严禁删除、修改或隐藏项目中的作者信息。
3. 任何基于本项目的二次开发或分发，都必须保留原作者信息。
4. 未经授权，不得将本项目用于商业用途。

Copyright (c) 2024 Handsome. All rights reserved.

## 联系方式

- 作者：Handsome
- GitHub: [HandsomeTab](https://github.com/acanyo/HandsomeTab)
- 邮箱：30819792@qq.com
- QQ：30819792
- 官网：[https://www.lik.cc](https://www.lik.cc)
- 演示：[https://tab.lik.cc](https://tab.lik.cc)
- 云服务：[雨云](https://www.rainyun.com/handsome_)