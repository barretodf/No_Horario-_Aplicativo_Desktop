const { app, BrowserWindow } = require('electron');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,  // Pode ser necessário desativar se for usar preload.js
            contextIsolation: true, // Aumenta a segurança
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile('index.html');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: true
                }
            });
            mainWindow.loadFile('index.html');
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
