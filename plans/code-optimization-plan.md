# 代码冗余清理与结构优化计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 清理冗余代码、提取公共逻辑、优化代码结构，提升可维护性和可读性。

**架构:** 通过提取公共模板、统一配置管理、消除重复函数来优化代码结构。

**技术栈:** HTML, CSS, JavaScript, Tailwind CSS, Flowbite

---

## 问题分析

### 1. HTML 模板重复
三个 HTML 文件存在大量重复代码：

| 文件                                         | 重复内容                      |
|----------------------------------------------|-------------------------------|
| [`index.html`](index.html)                   | head 区域、脚本引用           |
| [`pages/异议申诉.html`](pages/异议申诉.html) | head 区域、脚本引用、页面结构 |
| [`pages/每日必看.html`](pages/每日必看.html) | head 区域、脚本引用、页面结构 |

**重复代码示例（每个文件都有）：**
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
    tailwind.config = {
        darkMode: 'class'
    }
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css" />
```

### 2. JavaScript 函数重复
[`pages/异议申诉.html`](pages/异议申诉.html:52) 和 [`pages/每日必看.html`](pages/每日必看.html:64) 中的 `generateText()` 函数几乎完全相同：

```javascript
// 异议申诉.html 第52-71行
function generateText() {
    const inputs = document.querySelectorAll('input[data-name]');
    const validEntries = [];
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value && parseInt(value) > 0) {
            validEntries.push({ name: input.dataset.name, count: parseInt(value) });
        }
    });
    if (!validEntries.length) return showToast('请至少填写一个数量！');
    // ... 只有输出格式不同
}
```

### 3. CSS 选择器冗余
[`assets/css/common.css`](assets/css/common.css:8) 中深色模式选择器不统一：

```css
/* 三种不同的深色模式写法 */
.dark body,        /* 第8行 */
body.dark,         /* 第9行 */
html.dark body     /* 第13行 */
```

### 4. 配置分散
- Tailwind 配置在每个 HTML 文件中重复
- 人员数据硬编码在页面脚本中

### 5. 内联样式
[`index.html`](index.html:31) 第31行存在内联样式：
```html
<button type="button" class="btn-primary" style="background-color: #16a34a;">
```

### 6. 404页面样式不统一
[`404.html`](404.html) 使用原生 HTML，与项目风格不一致。

---

## 优化方案

### 方案 A: 提取公共函数到 common.js

将重复的 `generateText` 函数抽象为通用函数：

```javascript
// common.js 新增
function createTextGenerator(options) {
    const { formatLine, suffix } = options;
    return function() {
        const inputs = document.querySelectorAll('input[data-name]');
        const validEntries = [];
        
        inputs.forEach(input => {
            const value = input.value.trim();
            if (value && parseInt(value) > 0) {
                validEntries.push({ name: input.dataset.name, count: parseInt(value) });
            }
        });
        
        if (!validEntries.length) {
            showToast('请至少填写一个数量！');
            return;
        }
        
        const resultText = validEntries.map((e, i) => formatLine(e, i)).join('\n') + '\n' + suffix;
        
        copyToClipboard(resultText,
            () => showToast('已复制到剪贴板！'),
            () => showToast('复制失败')
        );
    };
}
```

### 方案 B: 统一 CSS 深色模式选择器

将所有深色模式选择器统一为 `html.dark` 格式：

```css
/* 删除冗余选择器，统一使用 html.dark */
html.dark body {
    background-color: #111827;
}
```

### 方案 C: 提取配置常量

创建配置文件管理常量：

```javascript
// assets/js/config.js
const CONFIG = {
    tailwind: {
        darkMode: 'class'
    },
    cdn: {
        tailwind: 'https://cdn.tailwindcss.com',
        flowbiteCss: 'https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css',
        flowbiteJs: 'https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js'
    }
};

// 页面数据配置
const PAGE_DATA = {
    objectionAppeal: {
        title: '📋 异议申诉',
        persons: ['王雨琛', '肖航辉', '谭晓悦', '税源管理股', '乐有为', '李彬督', '王文静', '分局'],
        formatLine: (e, i) => `${i + 1}. ${e.name}名下存在 ${e.count} 条任务`,
        suffix: '请尽快完成[社会社会]'
    },
    dailyWatch: {
        title: '📋 每日必看',
        groups: [
            { groupName: '新办户', members: ['分局', '税源'] },
            { groupName: '网格化', members: ['乐有为', '王文静', '李彬督', '肖磊'] }
        ],
        formatLine: (e, i) => `${i + 1}. ${e.name}账号下有${e.count}条任务`,
        suffix: '请尽快处理[社会社会]'
    }
};
```

### 方案 D: 添加按钮变体 CSS 类

替代内联样式：

```css
/* common.css 新增 */
.btn-success {
    width: 100%;
    background-color: #16a34a;
    color: white;
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
}

.btn-success:hover {
    background-color: #15803d;
}
```

### 方案 E: 优化 404 页面

使其与项目风格一致：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - 页面未找到</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/common.css" />
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="card text-center">
        <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p class="text-gray-600 mb-4">页面未找到</p>
        <a href="index.html" class="btn-secondary inline-block">返回首页</a>
    </div>
</body>
</html>
```

---

## 任务清单

### Task 1: 统一 CSS 深色模式选择器

**文件:**
- 修改: [`assets/css/common.css`](assets/css/common.css)

**步骤:**

1. 删除第8-10行的冗余选择器 `.dark body, body.dark`
2. 保留并统一使用 `html.dark` 前缀

**修改内容:**
```css
/* 删除 */
.dark body,
body.dark {
    background-color: #111827;
}

/* 保留 */
html.dark body {
    background-color: #111827;
}
```

---

### Task 2: 添加按钮变体类

**文件:**
- 修改: [`assets/css/common.css`](assets/css/common.css)

**步骤:**

1. 在 `.btn-primary:hover` 样式后添加 `.btn-success` 类

**添加内容:**
```css
.btn-success {
    width: 100%;
    background-color: #16a34a;
    color: white;
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
}

.btn-success:hover {
    background-color: #15803d;
}

html.dark .btn-success {
    background-color: #22c55e;
}

html.dark .btn-success:hover {
    background-color: #16a34a;
}
```

---

### Task 3: 移除内联样式

**文件:**
- 修改: [`index.html`](index.html:31)

**步骤:**

1. 将 `style="background-color: #16a34a;"` 替换为 `class="btn-success"`

**修改前:**
```html
<button type="button" class="btn-primary" style="background-color: #16a34a;">📝 每日必看</button>
```

**修改后:**
```html
<button type="button" class="btn-success">📝 每日必看</button>
```

---

### Task 4: 提取公共文本生成函数

**文件:**
- 修改: [`assets/js/common.js`](assets/js/common.js)
- 修改: [`pages/异议申诉.html`](pages/异议申诉.html)
- 修改: [`pages/每日必看.html`](pages/每日必看.html)

**步骤:**

1. 在 `common.js` 中添加通用文本生成函数
2. 更新两个页面使用新函数

**common.js 添加内容:**
```javascript
// 通用文本生成器
function createTextGenerator(options) {
    return function() {
        const inputs = document.querySelectorAll('input[data-name]');
        const validEntries = [];
        
        inputs.forEach(input => {
            const value = input.value.trim();
            if (value && parseInt(value) > 0) {
                validEntries.push({ name: input.dataset.name, count: parseInt(value) });
            }
        });
        
        if (!validEntries.length) {
            showToast('请至少填写一个数量！');
            return;
        }
        
        const resultText = validEntries.map((e, i) => options.formatLine(e, i)).join('\n') + '\n' + options.suffix;
        
        copyToClipboard(resultText,
            () => showToast('已复制到剪贴板！'),
            () => showToast('复制失败')
        );
    };
}
```

**异议申诉.html 简化后:**
```javascript
const PERSON_NAMES = ['王雨琛', '肖航辉', '谭晓悦', '税源管理股', '乐有为', '李彬督', '王文静', '分局'];

function renderPersonList() {
    const container = document.getElementById('personList');
    container.innerHTML = `
        <div class="form-container">
            ${PERSON_NAMES.map(name => `
                <div class="form-row">
                    <label class="form-label">${name}</label>
                    <input type="number" data-name="${name}" placeholder="数量" min="0" class="form-input">
                </div>
            `).join('')}
        </div>
    `;
}

const generateText = createTextGenerator({
    formatLine: (e, i) => `${i + 1}. ${e.name}名下存在 ${e.count} 条任务`,
    suffix: '请尽快完成[社会社会]'
});

document.getElementById('header').innerHTML = renderHeader('📋 异议申诉', true);
renderPersonList();
```

**每日必看.html 简化后:**
```javascript
const PERSON_GROUPS = [
    { groupName: '新办户', members: ['分局', '税源'] },
    { groupName: '网格化', members: ['乐有为', '王文静', '李彬督', '肖磊'] }
];

function renderPersonList() {
    // ... 保持不变
}

const generateText = createTextGenerator({
    formatLine: (e, i) => `${i + 1}. ${e.name}账号下有${e.count}条任务`,
    suffix: '请尽快处理[社会社会]'
});

document.getElementById('header').innerHTML = renderHeader('📋 每日必看', true);
renderPersonList();
```

---

### Task 5: 优化 404 页面

**文件:**
- 修改: [`404.html`](404.html)

**步骤:**

1. 重写 404 页面，使用项目统一的样式系统

**完整新内容:**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - 页面未找到</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class'
        }
    </script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css" />
    <link rel="stylesheet" href="assets/css/common.css" />
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="card text-center">
            <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p class="page-title mb-4">页面未找到</p>
            <p class="text-gray-500 text-sm mb-6">您访问的页面不存在或已被移除</p>
            <a href="index.html" class="btn-primary inline-block">返回首页</a>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
    <script src="assets/js/common.js"></script>
</body>
</html>
```

---

## 优化效果预期

| 指标           | 优化前          | 优化后             |
|----------------|-----------------|--------------------|
| CSS 冗余选择器 | 3种深色模式写法 | 统一为 `html.dark` |
| 内联样式       | 1处             | 0处                |
| 重复 JS 函数   | 2个相同函数     | 1个通用函数        |
| 404 页面风格   | 原生 HTML       | 统一项目风格       |
| 代码可维护性   | 低              | 高                 |

---

## 执行顺序

1. ✅ Task 1: 统一 CSS 深色模式选择器
2. ✅ Task 2: 添加按钮变体类
3. ✅ Task 3: 移除内联样式
4. ✅ Task 4: 提取公共文本生成函数
5. ✅ Task 5: 优化 404 页面

---

## 风险评估

- **低风险**: CSS 选择器统一、添加新类、404 页面优化
- **中风险**: 提取公共函数（需要测试两个页面功能正常）

建议每个任务完成后进行功能验证。