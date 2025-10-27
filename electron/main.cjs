const { app, BrowserWindow, globalShortcut, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// Windows平台特定设置
if (process.platform === 'win32') {
  // 设置应用用户模型ID，用于Windows通知和任务栏分组
  app.setAppUserModelId('com.stayfocused.app');
}

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    // Windows平台使用标准标题栏，macOS使用无标题栏
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    // 仅在macOS上设置交通灯按钮位置
    ...(process.platform === 'darwin' ? { trafficLightPosition: { x: 10, y: 10 } } : {}),
  });

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // Vite 开发服务器地址
    // 开发模式下使用快捷键打开开发者工具
    const devToolsShortcut = process.platform === 'darwin' ? 'Command+Option+I' : 'Control+Shift+I';
    globalShortcut.register(devToolsShortcut, () => {
      mainWindow.webContents.toggleDevTools();
    });
  } else {
    // 注册自定义协议处理音频文件
    protocol.registerFileProtocol('app', (request, callback) => {
      const url = request.url.substring(6); // 移除 'app://' 前缀
      try {
        // 将请求路径映射到应用目录
        let filePath;
        if (url.startsWith('/sounds/')) {
          // 对于声音文件使用正确路径
          filePath = path.join(__dirname, '../dist', url);
        } else {
          filePath = path.normalize(`${__dirname}/../dist/${url}`);
        }
        return callback(filePath);
      } catch (error) {
        console.error('Protocol error:', error);
        return callback(404);
      }
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 窗口关闭时退出应用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 当应用退出时注销所有快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 