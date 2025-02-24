const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

// ✅ Certifique-se de que esta variável é declarada antes de ser usada
const tasksFile = path.join(app.getPath('userData'), 'tasks.json'); 

function loadTasks() {
    try {
        if (fs.existsSync(tasksFile)) {
            return JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        return [];
    }
}

function saveTasks(tasks) {
    try {
        fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf-8');
    } catch (error) {
        console.error("Erro ao salvar tarefas:", error);
    }
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Adicionamos um preload.js para segurança
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
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
