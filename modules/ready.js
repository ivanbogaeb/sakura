const ready = async (windowProperties, HTMLFile, run, check, latest, download, update, close, currentVersion) => {
    let ready = await run(windowProperties, HTMLFile);
    if (ready){
        let mainVersion = await check();
        if (mainVersion){
            let latestVersion = await latest();
            if (latestVersion !== currentVersion){
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