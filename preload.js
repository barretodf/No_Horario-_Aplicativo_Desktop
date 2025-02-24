const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    loadTasks: () => ipcRenderer.invoke("loadTasks"),
    saveTasks: (tasks) => ipcRenderer.send("saveTasks", tasks),
});
