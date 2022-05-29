const path = require('path');
const axios = require('axios').default;

const latest = async (gitUsername, gitRepository) => {
    const url = `https://api.github.com/repos/${gitUsername}/${gitRepository}/releases/latest`;
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'json'
        });
        return response.data.tag_name;
    } catch (error){
        throw new Error(error);
    };
};

module.exports = latest;