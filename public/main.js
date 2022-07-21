const { app, BrowserWindow } = require('electron');
const isDev = require("electron-is-dev");
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 840, 
    height: 500,
    backgroundColor: '#484848',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        enableRemoteModule: true
    }
});


mainWindow.loadURL(
 `file://${path.join(__dirname, "./index.html")}`
);

 mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

//listen to an open-file-dialog command and sending back selected information

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    if (files) event.sender.send('selected-file', files)
  })
})