const {app, Menu, Tray, BrowserWindow, ipcMain} = require('electron');

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, frame: false})

  mainWindow.setMenu(null);

  mainWindow.setSkipTaskbar(true);

  tray = new Tray(`${__dirname}/favicon.ico`);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
            mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('YoutubeDesktopApp');

  tray.setContextMenu(contextMenu);

  tray.on('double-click', (modifiers, bounds) => {
    mainWindow.show();
  });

  tray.on('click', (modifiers, bounds) => {
    mainWindow.show();
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function (event) {
    mainWindow = null;
  })


  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  })

  mainWindow.on('minimize',function(event) {
    event.preventDefault();
  });

  mainWindow.on('enter-full-screen', () => {
    mainWindow.minimize();
    mainWindow.focus();
  });

  let ytdFullscreen = () => {
    mainWindow.setFullScreen(true);
    mainWindow.fullScreen = true;
  }

  let ytdUnFullscreen = () => {
    ipcMain.emit('ytd-pause');
    mainWindow.setFullScreen(false);
    mainWindow.fullScreen = false;
    mainWindow.hide();
  }

  ipcMain.on('ytd-fullscreen', (event, arg) => {
    ytdFullscreen();
  });

  ipcMain.on('ytd-unfullscreen', (event, arg) => {
    ytdUnFullscreen();
  });

  ipcMain.on('ytd-toggle-fullscreen', (event, arg) => {
    if (mainWindow.fullScreen)
      ytdUnFullscreen();
    else
      ytdFullscreen();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.