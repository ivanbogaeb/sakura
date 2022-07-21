const { compare } = require("compare-versions");
const ready = async (windowProperties, HTMLFile, splash, check, latest, download, update, close, currentVersion) => {
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