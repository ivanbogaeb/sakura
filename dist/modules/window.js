"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { BrowserWindow } = require('electron');
let sakuraWindow = {};
const windowCreator = (isElectron, properties, HTMLFile) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        if (isElectron) {
            sakuraWindow = new BrowserWindow(properties);
            sakuraWindow.removeMenu();
            sakuraWindow.loadFile(HTMLFile);
            sakuraWindow.webContents.on('did-finish-load', () => __awaiter(void 0, void 0, void 0, function* () {
                let ready = yield windowMessenger(isElectron, { type: 'activate', payload: sakuraWindow });
                if (ready) {
                    console.log("update screen");
                    resolve(true);
                }
                ;
            }));
        }
        resolve(true);
    }));
});
const windowMessenger = (isElectron, { type, payload }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        if (isElectron) {
            if (type == 'activate') {
                sakuraWindow = payload;
            }
            ;
            if (type == 'message') {
                if (payload.type) {
                    payload.loader.percentage = ((Number(payload.loader.data * 100)) / Number(payload.loader.total)).toFixed(2);
                }
                ;
                sakuraWindow.webContents.send('SakuraUpdater', payload);
            }
            ;
        }
        console.log("update screen message", payload);
        resolve(true);
    });
});
const windowClose = (isElectron) => {
    if (isElectron) {
        console.log("update screen closing");
        sakuraWindow.close();
    }
    ;
};
module.exports = { windowMessenger, windowCreator, windowClose };
