const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const fs = require("fs");
const path = require("path");

let tasks = [];
const filePath = path.join(app.getPath("userData"), "tasks.json");

// Função para carregar tarefas do arquivo JSON
function loadTasks() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        tasks = JSON.parse(data);
    }
}

// Função para salvar tarefas no arquivo JSON
function saveTasks() {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Função para verificar e disparar notificações de tarefas pendentes
function checkTaskNotifications() {
    const now = new Date();

    tasks.forEach((task) => {
        if (!task.time || task.notified) return; // Se a tarefa não tem horário ou já foi notificada, ignora

        const taskTime = new Date(task.time); // Converte string para objeto Date

        // Se a hora já passou e a tarefa ainda não foi notificada
        if (now >= taskTime) {
            new Notification({ 
                title: "Tarefa Pendente!", 
                body: `Está na hora de: ${task.text}` 
            }).show();

            // Marcar a tarefa como notificada (sem removê-la da lista)
            task.notified = true;
            saveTasks(); // Salvar a lista atualizada no arquivo JSON
        }
    });
}

// Inicialização do aplicativo
app.whenReady().then(() => {
    loadTasks(); // Carrega as tarefas ao iniciar o app

    // Configura a janela principal
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

    // Roda a verificação de notificações a cada minuto
    setInterval(checkTaskNotifications, 60000);
});

// Handlers para comunicação entre o processo principal e o renderizador
ipcMain.handle("loadTasks", () => tasks);
ipcMain.handle("saveTasks", (event, newTasks) => {
    tasks = newTasks;
    saveTasks();
});