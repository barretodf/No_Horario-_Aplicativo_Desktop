const { app, BrowserWindow, ipcMain, Notification } = require("electron");
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

// Verifica e agenda notificações para tarefas pendentes
function checkTaskNotifications() {
    const now = new Date();

    tasks.forEach((task, index) => {
        if (!task.time) return; // Se a tarefa não tem horário, ignora

        const taskTime = new Date(task.time); // Converte string para objeto Date

        // Se a hora já passou e a tarefa ainda não foi notificada
        if (now >= taskTime) {
            new Notification({ 
                title: "Tarefa Pendente!", 
                body: `Está na hora de: ${task.text}` 
            }).show();

            // Remover a tarefa da lista após a notificação (evita repetir)
            tasks.splice(index, 1);
            saveTasks();
        }
    });
}

// Roda a verificação de notificações a cada minuto
setInterval(checkTaskNotifications, 60000);

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
