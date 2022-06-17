const axios = require('axios').default;
const timer = require('./timer');

const latest = async (windowMessenger, isElectron, messages, gitUsername, gitRepository, privateToken) => {
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: messages.fetching, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        await timer(1000);
        if (data){
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
            return {tagname: response.data.tag_name, url: response.data.assets[0].url};
        };
    } catch (error){
        throw new Error(error);
    };
};

module.exports = latest;