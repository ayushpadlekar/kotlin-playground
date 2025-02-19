const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onNavigate: (callback) => ipcRenderer.on('navigate', callback),
  send: (channel, data) => ipcRenderer.invoke(channel, data),
  handle: (channel, callable, event, data) => ipcRenderer.on(channel, callable(event, data)),
});