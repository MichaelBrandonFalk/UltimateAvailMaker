"use strict";

const { app, BrowserWindow, clipboard, dialog, ipcMain, Menu, shell } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const APP_ID = "com.michaelbrandonfalk.ultimateavailmaker";
const INDEX_PATH = path.join(__dirname, "..", "index.html");
const INDEX_URL = pathToFileURL(INDEX_PATH).href;
const ICON_PATH = path.join(__dirname, "..", "assets", "ultimate-avail-maker-logo.png");
let mainWindow = null;

function isTrustedSender(event) {
  return Boolean(
    mainWindow
    && event.sender === mainWindow.webContents
    && event.senderFrame === mainWindow.webContents.mainFrame
    && event.senderFrame.url === INDEX_URL
  );
}

function safeWorkbookName(value) {
  const requested = typeof value === "string" ? path.basename(value) : "Avails.xlsx";
  const cleaned = requested.replace(/[<>:"\/\\|?*\u0000-\u001f]/g, "_").trim();
  const name = cleaned || "Avails.xlsx";
  return name.toLowerCase().endsWith(".xlsx") ? name : `${name}.xlsx`;
}

async function saveWorkbook(event, payload) {
  if (!isTrustedSender(event) || !payload || typeof payload.base64 !== "string") return;

  const filename = safeWorkbookName(payload.filename);
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: [{ name: "Excel Workbook", extensions: ["xlsx"] }],
    properties: ["createDirectory", "showOverwriteConfirmation"]
  });
  if (result.canceled || !result.filePath) return;

  try {
    await fs.writeFile(result.filePath, Buffer.from(payload.base64, "base64"));
  } catch (error) {
    await dialog.showMessageBox(mainWindow, {
      type: "error",
      title: "Could not save workbook",
      message: "Ultimate Avail Maker could not save the workbook.",
      detail: error.message
    });
  }
}

function copyText(event, payload) {
  if (!isTrustedSender(event) || !payload || typeof payload.text !== "string") return;
  clipboard.writeText(payload.text);
}

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        { role: "close" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 900,
    minHeight: 650,
    title: "Ultimate Avail Maker",
    icon: ICON_PATH,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) void shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url !== INDEX_URL) event.preventDefault();
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  void mainWindow.loadFile(INDEX_PATH);
}

app.setAppUserModelId(APP_ID);
app.whenReady().then(() => {
  createMenu();
  ipcMain.on("save-workbook", saveWorkbook);
  ipcMain.on("copy-text", copyText);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
