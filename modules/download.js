const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const download = async (gitUsername, gitRepository, privateToken) => {
    
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

        if (!fs.existsSync(path.join(__dirname, '../updates'))) {
            fs.mkdirSync(path.join(__dirname, '../updates'));
        };

        const w = await download.data.pipe(fs.createWriteStream(path.join(__dirname, '../updates/', response.data.assets[0].name)));

        let data = await w.on('finish', () => {});

        return true;
    } catch (error){
        throw new Error(error);
    };
};

module.exports = download;