const latest = async (axios:any, timer:any, windowMessenger:any, isElectron:boolean, messages:any, gitUsername:string, gitRepository:string, privateToken:string) => {
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: messages.fetching, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        await timer(2000);
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
            try {
                const response = await axios(options);
                try {
                    return {tagname: response.data.tag_name, url: response.data.assets[0].url};
                } catch {
                    await windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: "This repository must be private or doesn't exist, please check it's privileges.", loader: {active: false, data: 0, total: 0, percentage: 0}}});
                    await timer(2000);
                    return {error: "This repository must be private or doesn't exist, please check it's privileges.", code: 404};
                };
            } catch (error){
                await windowMessenger(isElectron, {type: 'message', payload: {type: 1, text: "Unable to communicate with updating service, skipping update check...", loader: {active: false, data: 0, total: 0, percentage: 0}}});
                await timer(2000);
                return {error: "Unable to communicate with updating service, skipping update check...", code: 12002};
            };
        };
    } catch (error:any){
        throw new Error(error);
    };
};

module.exports = latest;