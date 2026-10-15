"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ultimateAvailDesktop", Object.freeze({
  saveWorkbook(payload) {
    ipcRenderer.send("save-workbook", payload);
  },
  copyText(payload) {
    ipcRenderer.send("copy-text", payload);
  }
}));
