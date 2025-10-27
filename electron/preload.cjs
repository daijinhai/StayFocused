const { contextBridge, ipcRenderer } = require('electron');

// 在窗口加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  // 添加样式，为内容提供足够的上边距
  const style = document.createElement('style');
  style.textContent = `
    body {
      padding-top: 28px !important; /* 为窗口控制按钮留出空间 */
    }
    
    /* 创建可拖拽区域 */
    .titlebar-drag-region {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 28px;
      -webkit-app-region: drag;
      z-index: 1000;
      pointer-events: none;
    }
    
    /* 确保交互元素不受拖拽影响 */
    button, select, input, a, [role="button"], [role="link"], [role="menuitem"] {
      -webkit-app-region: no-drag;
      pointer-events: auto;
    }
  `;
  document.head.appendChild(style);
  
  // 创建拖拽区域元素
  const dragRegion = document.createElement('div');
  dragRegion.className = 'titlebar-drag-region';
  document.body.appendChild(dragRegion);
  
  // 暴露 Electron API 到渲染进程
  contextBridge.exposeInMainWorld('electron', {
    // 应用信息
    isElectron: true,
    
    // 播放器相关API
    player: {
      canPlayAudio: true,
      getAudioPath: (relativePath) => {
        // 确保路径正确处理
        if (relativePath.startsWith('/')) {
          return `app:/${relativePath}`;
        }
        return `app:/${relativePath}`;
      }
    },
    
    // 其他可能需要的API
    appInfo: {
      version: process.env.npm_package_version || '1.0.0',
      name: process.env.npm_package_name || 'StayFocused'
    }
  });
}); 