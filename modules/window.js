const {BrowserWindow} = require('electron');

let window = '';

const windowCreator = async (isElectron, properties, HTMLFile) => {
    return new Promise(async (resolve) => {
        if (isElectron){
            window = new BrowserWindow(properties);
            window.removeMenu();
            window.loadFile(HTMLFile);
            window.webContents.on('did-finish-load', async () => {
                let ready = await windowMessenger(isElectron, {type: 'activate', payload: window});
                if (ready){
                    resolve(true);
                };
            });
        }
        resolve(true);    
    });
};

const windowMessenger = async (isElectron, {type, payload}) => {
    return new Promise((resolve) => {
        if (isElectron){
            if (type == 'activate'){
                window = payload;
            };
            if (type == 'message'){
                if (payload.type === 2){
                    payload.loader.percentage = ((Number(payload.loader.data * 100))/Number(payload.loader.total)).toFixed(2);
                };
                window.webContents.send('SakuraUpdater', payload);
            };
        }
        resolve(true);
    });
};

const windowClose = (isElectron) => {
    if (isElectron){
        window.close();
    };
};

module.exports = {windowMessenger, windowCreator, windowClose};