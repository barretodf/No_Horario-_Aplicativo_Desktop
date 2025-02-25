const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let tasks = [];
const filePath = path.join(app.getPath("userData"), "tasks.json");

// Carregar tarefas do arquivo JSON
function loadTasks() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        tasks = JSON.parse(data);
    }
}

// Salvar tarefas no arquivo JSON
function saveTasks() {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

app.whenReady().then(() => {
    loadTasks();
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadFile("index.html");
});

// Handlers para carregar e salvar tarefas
ipcMain.handle("loadTasks", () => tasks);
ipcMain.handle("saveTasks", (event, newTasks) => {
    tasks = newTasks;
    saveTasks();
});
