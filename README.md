# HandsomeTab - 优雅的新标签页扩展

HandsomeTab 是一个美观实用的浏览器新标签页扩展，为您提供个性化的浏览体验。

## 主要功能

- 🎨 自定义背景设置
  - 支持本地图片上传
  - 支持在线图片链接
  - 支持纯色背景

- 🌤️ 实时天气显示
  - 基于IP的自动定位
  - 显示当前天气状况
  - 显示实时温度

- 👋 智能欢迎语
  - 根据位置显示个性化欢迎信息
  - 定时更新提醒

## 技术栈

- Vue 3
- Element Plus
- Vite
- JavaScript

## 开发说明

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建项目
```bash
npm run build
```

## 项目结构

```
src/
├── components/     # 组件目录
├── services/      # 服务层
├── stores/        # 状态管理
├── styles/        # 样式文件
└── utils/         # 工具函数
```

## 配置说明

- 天气服务：使用腾讯位置服务API
- 背景设置：支持本地存储
- 主题定制：支持深色/浅色模式

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License
