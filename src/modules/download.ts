const download = async (fs:any, path:any, axios:any, windowMessenger:any, isElectron:boolean, messages:any, downloadURL:string, privateToken:string, installationDirectory:string, versionName:string) => {
    if (installationDirectory == ''){
        throw new Error('You must introduce an installation directory in order to download a new version.');
    }
    if (versionName == ''){
        throw new Error('You need to fetch the latest version information first in order to request a download.');
    };

    return new Promise(async (resolve) => {
        try {
            let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: messages.downloading, loader: {active: false, data: 0, total: 0, percentage: 0}}});
            if (data){
                let options:any = {
                    method: 'GET',
                    url: downloadURL,
                    responseType: 'stream',
                    headers: {
                        'Accept': 'application/octet-stream'
                    }
                };

                if (privateToken.length > 1){
                    options.headers = {
                        'Accept': 'application/octet-stream',
                        Authorization: `token ${privateToken}`
                    };
                };

                const download = await axios(options);
                let downloadFolder = '';
                if (isElectron){
                    let currentDir = installationDirectory.split(path.sep);
                    let isASAR = currentDir.find((element) => {
                        if (element.includes('app.asar')){
                            return true;
                        };
                    });
                    if (isASAR){
                        downloadFolder = path.join(installationDirectory, '../updates');
                    } else {
                        downloadFolder = path.join(installationDirectory, './updates');
                    }
                };

                if (!fs.existsSync(downloadFolder)) {
                    fs.mkdirSync(downloadFolder);
                };

                const w = download.data.pipe(fs.createWriteStream(path.join(downloadFolder, `${versionName}.zip`)));
                let interval = setInterval(() => {
                    windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: messages.downloading, loader: {active: true, data: w.bytesWritten, total: download.headers['content-length'], percentage: 0}}});
                }, 100);
                await w.on('finish', () => {
                    clearInterval(interval);
                    resolve(true);
                });
            };
        } catch (error:any){
            console.log(error);
            throw new Error(error);
        };
    });
};

module.exports = download;