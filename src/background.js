"use strict";

import { app, protocol, BrowserWindow, Menu, screen } from "electron";
import {
  createProtocol
  /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

global.LOG_LEVEL = isDevelopment ? "debug" : "info";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let icon = path.join("src", "assets", "icons", "png", "icon.png");
  console.log(icon);

  // Create the browser window.
  win = new BrowserWindow({
    width: width - 200,
    height: height - 200,
    webPreferences: {
      nodeIntegration: true
    },
    show: false,
    icon: icon
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  win.setTitle("Red Giant Client Toolkit");

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });

  win.on("ready-to-show", () => {
    win.show();
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Tools",
        submenu: [
          {
            label: "Port Scan",
            click() {
              win.webContents.send("navTo", "scan");
            }
          },
          {
            label: "License Scan",
            click() {
              win.webContents.send("navTo", "license");
            }
          },
          {
            label: "License Creator",
            click() {
              win.webContents.send("navTo", "create");
            }
          },
          {
            label: "Serial Removal",
            click() {
              win.webContents.send("navTo", "serials");
            }
          },
          {
            label: "Other Tools",
            click() {
              win.webContents.send("navTo", "options");
            }
          }
        ]
      },
      {
        role: "quit"
      }
    ]
  }
];

if (process.platform == "darwin") {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV != "production") {
  menuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });

  menuTemplate.push({
    label: "Log Level",
    submenu: [
      {
        label: "None",
        click() {
          setLogLevel("none");
        }
      },
      {
        label: "Info",
        click() {
          setLogLevel("info");
        }
      },
      {
        label: "Verbose",
        click() {
          setLogLevel("verbose");
        }
      },
      {
        label: "Debug",
        click() {
          setLogLevel("debug");
        }
      }
    ]
  });
}

function setLogLevel(level) {
  global.LOG_LEVEL = level;
  win.webContents.send("logLevelUpdated");
}
