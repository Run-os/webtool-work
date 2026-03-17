# 实用工具箱

一个基于 Tailwind CSS + FontAwesome 的现代化工具集合网站，采用移动端优先设计，固定深色主题。

## 项目结构

```
webtool-work/
├── assets/
│   ├── css/
│   │   └── common.css       # 公共样式
│   ├── js/
│   │   └── common.js        # 公共脚本（图标、工具函数）
│   └── images/
│       ├── bg-mobile.jpg    # 移动端背景图
│       ├── bg-desktop.jpg   # 桌面端背景图
│       └── logo.png         # 工具箱logo
├── pages/
│   ├── 异议申诉.html        # 异议申诉独立页面
│   └── 每日必看.html        # 每日必看独立页面
├── index.html               # 主入口页面
└── README.md                # 说明文档
```

## 功能特性

### 🎨 现代化UI设计
- 毛玻璃效果（backdrop-blur）增强现代感
- 统一色彩体系（主色调 `#6b7280` 灰色）
- 阴影、圆角、过渡动画提升交互质感
- FontAwesome 图标集成

### 📱 移动端优先
- 使用 Tailwind 的 `md:` 前缀区分移动端/桌面端样式
- 背景图按设备尺寸加载（移动端用竖版、桌面端用横版）
- 卡片宽度适配（移动端100%，桌面端最大400px）
- 按钮、表单元素全宽展示，适配手机触摸操作

### 🌙 深色主题
- 固定为深色主题，保护视力
- 统一的深色配色方案
- 所有元素完美适配深色模式

### 🛠️ 工具功能
- **异议申诉**：快速生成申诉文本，一键复制到剪贴板
- **每日必看**：快速生成每日任务提醒，一键复制
- **Jidrop**：外部链接跳转

## 技术栈

- **CSS框架**：Tailwind CSS v3.x
- **图标库**：FontAwesome 6.4.0
- **组件库**：Flowbite 2.5.2
- **字体**：Inter（现代无衬线字体）

## 快速开始

1. 克隆项目到本地
2. 添加背景图片到 `assets/images/` 目录：
   - `bg-mobile.jpg` - 移动端背景图（推荐尺寸：1080x1920）
   - `bg-desktop.jpg` - 桌面端背景图（推荐尺寸：1920x1080）
   - `logo.png` - 工具箱Logo（推荐尺寸：96x96）
3. 使用浏览器打开 `index.html` 即可使用

## 资源替换

### 背景图
可从以下网站下载免费图片：
- [Unsplash](https://unsplash.com/s/photos/minimalist-background)
- [Pexels](https://www.pexels.com/zh-cn/)

### Logo
可从以下网站获取图标：
- [Iconfont（阿里图标库）](https://www.iconfont.cn/)
- [FontAwesome](https://fontawesome.com/icons)

## 自定义配置

### 修改主色调
在 `index.html` 和各子页面的 Tailwind 配置中修改：

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#6b7280', // 修改为你想要的主色调
            },
        }
    }
}
```

### 添加新工具
1. 在 `pages/` 目录下创建新的 HTML 文件
2. 在 `index.html` 中添加对应的导航按钮
3. 在 `assets/js/common.js` 的 `iconMap` 中添加新图标映射

## 浏览器支持

- Chrome（推荐）
- Firefox
- Safari
- Edge

## 许可证

MIT License

---

© 2025 实用工具箱 | 所有工具仅供参考使用