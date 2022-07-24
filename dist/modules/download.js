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
const download = (fs, path, axios, windowMessenger, isElectron, messages, downloadURL, privateToken, installationDirectory, versionName) => __awaiter(void 0, void 0, void 0, function* () {
    if (installationDirectory == '') {
        throw new Error('You must introduce an installation directory in order to download a new version.');
    }
    if (versionName == '') {
        throw new Error('You need to fetch the latest version information first in order to request a download.');
    }
    ;
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let data = yield windowMessenger(isElectron, { type: 'message', payload: { type: 1, text: messages.downloading, loader: { active: false, data: 0, total: 0, percentage: 0 } } });
            if (data) {
                let options = {
                    method: 'GET',
                    url: downloadURL,
                    responseType: 'stream',
                    headers: {
                        'Accept': 'application/octet-stream'
                    }
                };
                if (privateToken.length > 1) {
                    options.headers = {
                        'Accept': 'application/octet-stream',
                        Authorization: `token ${privateToken}`
                    };
                }
                ;
                const download = yield axios(options);
                let downloadFolder = '';
                if (isElectron) {
                    let currentDir = installationDirectory.split(path.sep);
                    let isASAR = currentDir.find((element) => {
                        if (element.includes('app.asar')) {
                            return true;
                        }
                        ;
                    });
                    if (isASAR) {
                        downloadFolder = path.join(installationDirectory, '../updates');
                    }
                    else {
                        downloadFolder = path.join(installationDirectory, './updates');
                    }
                }
                ;
                if (!fs.existsSync(downloadFolder)) {
                    fs.mkdirSync(downloadFolder);
                }
                ;
                const w = download.data.pipe(fs.createWriteStream(path.join(downloadFolder, `${versionName}.zip`)));
                let interval = setInterval(() => {
                    windowMessenger(isElectron, { type: 'message', payload: { type: 1, text: messages.downloading, loader: { active: true, data: w.bytesWritten, total: download.headers['content-length'], percentage: 0 } } });
                }, 100);
                yield w.on('finish', () => {
                    clearInterval(interval);
                    resolve(true);
                });
            }
            ;
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
        ;
    }));
});
module.exports = download;
