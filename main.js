const { app, BrowserWindow, Menu, ipcMain, globalShortcut, webContents } = require('electron/main');
const path = require('node:path');

let activeWebviewId = null; // Store the currently active webview ID

const createWindow = () => {
  const win = new BrowserWindow({
    backgroundColor: '#f9ebff',
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  // Start app in maximized mode
  win.maximize();

  // Load the local HTML file
  win.loadFile('index.html');



  win.webContents.on("did-attach-webview", (event, webviewContents) => {
    if (activeWebviewId === null) {
      activeWebviewId = webviewContents.id; // Set initial active webview
    }

    webviewContents.on('focus', () => {
      activeWebviewId = webviewContents.id; // Update active webview ID on focus
    });

    webviewContents.setWindowOpenHandler((details) => {
      win.webContents.send('create-new-tab', details.url); // Send message to renderer
      return { action: 'deny' };
    });
  });


  // Create a custom menu
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New Window', click: () => { /* Open new window */ } },
        { label: 'Open File', click: () => { /* Open file dialog */ } },
        { label: 'Save', click: () => { /* Save current state */ } },
        { label: 'Save As', click: () => { /* Save as dialog */ } },
        { type: 'separator' },
        { label: 'Print', click: () => { /* Print functionality */ } },
        { type: 'separator' },
        { label: 'Preferences', click: () => { /* Open settings */ } },
        { type: 'separator' },
        { role: 'about' }, // Add an About option
        { role: 'quit' }, // Add a Quit option
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Dark Mode', click: () => { /* Toggle dark mode */ } },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { label: 'New Window', click: () => { /* Open new window */ } },
        { type: 'separator' },
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://www.electronjs.org');
          },
        },
      ],
    },
    {
      label: '⟳ Reload',
      click: () => {
        win.webContents.send('reload-active-tab'); // Send message to renderer
      },
    },
    // Add Back and Forward buttons
    {
      label: '< Back',
      click: () => {
        win.webContents.send('navigate', 'back');
      },
    },
    {
      label: 'Next >',
      click: () => {
        win.webContents.send('navigate', 'forward');
      },
    },
    {
      label: 'Keyboard Shortcuts ?',
      click: () => {
        win.webContents.send('show-shortcuts-dialog');
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);



  // Register global shortcuts for reload // Ctrl+R
  globalShortcut.register('Ctrl+R', () => {
    win.webContents.send('reload-active-tab');
  });


  // Register global shortcuts for navigation // Main ALT
  globalShortcut.register('Alt+Left', () => {
    win.webContents.send('navigate', 'back');
  });

  globalShortcut.register('Alt+Right', () => {
    win.webContents.send('navigate', 'forward');
  });

  // Register global shortcuts for navigation // ALT-Gr or Ctrl+Alt
  globalShortcut.register('Ctrl+Alt+Left', () => {
    win.webContents.send('navigate', 'back');
  });

  globalShortcut.register('Ctrl+Alt+Right', () => {
    win.webContents.send('navigate', 'forward');
  });



  // Register global shortcuts for zooming
  globalShortcut.register('CommandOrControl+=', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor += 0.1;
      }
    }
  });

  globalShortcut.register('CommandOrControl+Shift+=', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor += 0.1;
      }
    }
  });

  globalShortcut.register('CommandOrControl+-', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor -= 0.1;
      }
    }
  });

  globalShortcut.register('CommandOrControl+0', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor = 0.8;
      }
    }
  });

  // Register numpad shortcuts for zooming
  globalShortcut.register('CommandOrControl+numadd', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor += 0.1;
      }
    }
  });

  globalShortcut.register('CommandOrControl+numsub', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor -= 0.1;
      }
    }
  });

  // Reset zoom from numpad's 0 key
  globalShortcut.register('CommandOrControl+num0', () => {
    if (activeWebviewId) {
      const activeWebview = webContents.fromId(activeWebviewId);
      if (activeWebview) {
        activeWebview.zoomFactor = 0.8;
      }
    }
  });



};




app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});