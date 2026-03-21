/**
 * 公共组件和工具函数
 */

// 自动检测资源路径前缀（根据当前页面位置）
const ASSETS_PREFIX = (function () {
    const path = window.location.pathname;
    // 如果路径包含 /pages/，说明在子目录中
    if (path.includes('/pages/')) {
        return '../';
    }
    return '';
})();

// 初始化公共 HEAD 资源
(function initCommonHead() {
    // 添加 favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = `${ASSETS_PREFIX}assets/images/icon.png`;
    document.head.appendChild(favicon);

    // 添加 Tailwind CSS
    const tailwind = document.createElement('script');
    tailwind.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwind);

    // 添加公共样式
    const commonCss = document.createElement('link');
    commonCss.rel = 'stylesheet';
    commonCss.href = `${ASSETS_PREFIX}assets/css/common.css`;
    document.head.appendChild(commonCss);

    // 加载 FontAwesome 图标
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://fontawesome.ywxmz.com/7.0.1/css/all.min.css';
    document.head.appendChild(fontAwesome);
})();

// 获取图标函数（统一管理图标样式）
function getIcon(iconName, className = 'w-5 h-5') {
    const iconMap = {
        settings: 'fa-cog',        // 工具箱主图标
        barChart: 'fa-chart-bar',  // 异议申诉图标
        fileText: 'fa-file-text',  // 每日必看图标
        jidrop: 'fa-cloud-upload', // Jidrop图标
        back: 'fa-arrow-left',     // 返回按钮图标
        exclamationCircle: 'fa-exclamation-circle', // 感叹号图标
        home: 'fa-house'           // 首页图标
    };
    return `<i class="fa-solid ${iconMap[iconName] || iconName} ${className}"></i>`;
}

// 渲染标题栏函数
function renderHeader(titleContent) {
    return `
        <div class="flex items-center justify-center py-4 px-5 bg-gray-800/90 rounded-t-lg shadow-sm">
            <div class="text-lg font-semibold text-white">${titleContent}</div>
        </div>
    `;
}

// 初始化深色模式（固定为深色）
function initDarkMode() {
    document.documentElement.classList.add('dark');
}

// 生成 Toast HTML
function renderToast() {
    return `
        <div id="toast" class="fixed bottom-4 right-4 flex items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 opacity-0 transition-opacity duration-300" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <div class="ml-3 text-sm font-normal" id="toastMessage">toast文本</div>
        </div>
    `;
}

// Toast 提示
function showToast(msg) {
    let toast = document.getElementById('toast');
    let toastMessage = document.getElementById('toastMessage');

    // 如果 toast 不存在，创建它
    if (!toast) {
        document.body.insertAdjacentHTML('beforeend', renderToast());
        toast = document.getElementById('toast');
        toastMessage = document.getElementById('toastMessage');
    }

    toastMessage.textContent = msg;
    toast.classList.replace('opacity-0', 'opacity-100');
    setTimeout(() => toast.classList.replace('opacity-100', 'opacity-0'), 2000);
}

// 复制到剪贴板
function copyToClipboard(text, onSuccess, onFail) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(onFail);
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            onSuccess();
        } catch (err) {
            onFail();
        }
        document.body.removeChild(ta);
    }
}

// 实时更新分组合计
function updateGroupTotals() {
    const totalElements = document.querySelectorAll('.group-total');
    totalElements.forEach(el => {
        const groupIndex = el.dataset.groupIndex;
        const inputs = document.querySelectorAll(`input[data-group-index="${groupIndex}"]`);
        let total = 0;
        inputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        el.textContent = total;
    });
}

// 页面加载完成后初始化深色模式
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
});
