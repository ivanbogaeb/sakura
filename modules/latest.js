const path = require('path');
const axios = require('axios').default;

const latest = async (gitUsername, gitRepository, downloadVersion) => {
    const url = `https://api.github.com/repos/${gitUsername}/${gitRepository}/releases/latest`;
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'json'
        });
        downloadVersion = response.data.tag_name;
        return downloadVersion;
    } catch (error){
        throw new Error(error);
    };
};

module.exports = latest;