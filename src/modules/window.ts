const {BrowserWindow} = require('electron');

let sakuraWindow:any = {};

const windowCreator = async (isElectron:boolean, properties:any, HTMLFile:string) => {
    return new Promise(async (resolve) => {
        if (isElectron){
            sakuraWindow = new BrowserWindow(properties);
            sakuraWindow.removeMenu();
            sakuraWindow.loadFile(HTMLFile);
            sakuraWindow.webContents.on('did-finish-load', async () => {
                let ready = await windowMessenger(isElectron, {type: 'activate', payload: sakuraWindow});
                if (ready){
                    resolve(true);
                };
            });
        }
        resolve(true);    
    });
};

const windowMessenger = async (isElectron:boolean, {type, payload}:any) => {
    return new Promise((resolve) => {
        if (isElectron){
            if (type == 'activate'){
                sakuraWindow = payload;
            };
            if (type == 'message'){
                if (payload.type){
                    payload.loader.percentage = ((Number(payload.loader.data * 100))/Number(payload.loader.total)).toFixed(2);
                };
                sakuraWindow.webContents.send('SakuraUpdater', payload);
            };
        }
        resolve(true);
    });
};

const windowClose = (isElectron:boolean) => {
    if (isElectron){
        sakuraWindow.close();
    };
};

module.exports = {windowMessenger, windowCreator, windowClose};