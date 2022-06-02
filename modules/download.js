const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const download = async (gitUsername, gitRepository, privateToken, installationDirectory, versionName) => {
    if (installationDirectory == ''){
        throw new Error('You must introduce an installation directory in order to download a new version.');
    }
    if (versionName == ''){
        throw new Error('You need to fetch the latest version information first in order to request a download.');
    };

    return new Promise(async (resolve) => {
        const url = `https://api.github.com/repos/${gitUsername}/${gitRepository}/releases/latest`;
        let options = {
            method: 'GET',
            url: url,
            responseType: 'json' // stream
        };
        try {
            const response = await axios(options);
            if (privateToken.length > 1){
                options.headers = {
                    Authorization: `token ${privateToken}`
                };
            };
            options.url = response.data.assets[0].browser_download_url;
            options.responseType = 'stream';
            const download = await axios(options);

            let downloadFolder = path.join(installationDirectory, './updates');

            if (!fs.existsSync(downloadFolder)) {
                fs.mkdirSync(downloadFolder);
            };

            const w = await download.data.pipe(fs.createWriteStream(path.join(downloadFolder, `${versionName}.zip`)));

            await w.on('finish', () => {
                resolve(true);
            });
        } catch (error){
            throw new Error(error);
        };
    });
};

module.exports = download;