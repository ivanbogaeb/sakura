const latest = async (axios:any, timer:any, windowMessenger:any, isElectron:boolean, messages:any, gitUsername:string, gitRepository:string, privateToken:string) => {
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: messages.fetching, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        await timer(1000);
        if (data){
            let options:any = {
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
    } catch (error:any){
        throw new Error(error);
    };
};

module.exports = latest;