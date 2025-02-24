const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadTasks: () => ipcRenderer.invoke('loadTasks'),
    saveTasks: (tasks) => ipcRenderer.send('saveTasks', tasks)
});
