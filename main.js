const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
const tasksFile = path.join(app.getPath('userData'), 'tasks.json'); // Salva no diretório do usuário

function loadTasks() {
    try {
        return JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
    } catch (error) {
        return []; // Retorna uma lista vazia se o arquivo não existir
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Adicionamos um preload.js para segurança
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
});

ipcMain.handle('loadTasks', () => loadTasks());
ipcMain.on('saveTasks', (event, tasks) => saveTasks(tasks));

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
