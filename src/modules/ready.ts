
const ready = async (compare:any, windowProperties:any , HTMLFile:string, splash:any, check:any, latest:any, download:any, update:any, close:any, currentVersion:any) => {
    let ready = await splash(windowProperties, HTMLFile);
    if (ready){
        let mainVersion = await check();
        if (mainVersion){
            let latestVersion = await latest();
            if (compare(latestVersion, currentVersion, '>')){
                let downloadLatestVersion = await download();
                if (downloadLatestVersion){
                    await update();
                };
            };
        };
        close();
        return true;
    };
};

module.exports = ready;