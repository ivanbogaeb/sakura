const path = require('path');
const axios = require('axios').default;

const latest = async (gitUsername, gitRepository, privateToken) => {
    try {
        let options = {
            method: 'GET',
            url: `https://api.github.com/repos/${gitUsername}/${gitRepository}/releases/latest`,
            responseType: 'json'
        };

        if (privateToken.length > 1){
            options.headers = {
                Authorization: `token ${privateToken}`
            };
        };
        const response = await axios(options);
        return {tagname: response.data.tag_name, url: response.data.assets[0].browser_download_url};
    } catch (error){
        throw new Error(error);
    };
};

module.exports = latest;