const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const download = async (privateToken, installationDirectory, versionName, downloadURL) => {
    if (installationDirectory == ''){
        throw new Error('You must introduce an installation directory in order to download a new version.');
    }
    if (versionName == ''){
        throw new Error('You need to fetch the latest version information first in order to request a download.');
    };

    return new Promise(async (resolve) => {
        try {

            let options = {
                method: 'GET',
                url: downloadURL,
                responseType: 'stream' // stream
            };

            if (privateToken.length > 1){
                options.headers = {
                    Authorization: `token ${privateToken}`
                };
            };

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