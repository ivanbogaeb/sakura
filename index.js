class Sakupdater {
    constructor(){

        // Imports
        const check = require('./modules/check');
        const latest = require('./modules/latest');
        const update = require('./modules/update');
        const download = require('./modules/download');

        // Settings
        this.gitUsername = '';
        this.gitRepository = '';
        this.privateToken = '';
        this.installationDirectory = '';
        this.hasEXEFile = false;
        this.fileEXEName = '';

        // Versioning
        this.currentVersion = '';
        let newVersion = '';
        let downloadURL = '';

        // Functions

        this.check = async (directory) => { // Check if this is an update or the 'main' version
            return await check(directory);
        };
        this.latest = async () => { // Get latest version and store
            let {tagname, url} = await latest(this.gitUsername, this.gitRepository, this.privateToken);
            newVersion = tagname;
            downloadURL = url;
            if (this.currentVersion == newVersion){
                return {error: "Your version is up to date."};
            } else {
                return tagname;
            };
        };
        this.download = async () => {
            if (this.currentVersion !== newVersion){
                return await download(this.privateToken, this.installationDirectory, this.currentVersion, downloadURL);
            } else {
                return {error: "You are running the latest version available."};
            };   
        };
        this.update = async () => {
            if (this.currentVersion !== newVersion){
                return await update(this.installationDirectory, this.currentVersion, newVersion, this.hasEXEFile, this.fileEXEName);
            } else {
                return {error: "No updates available."};
            };
        };
    };
};

module.exports = Sakupdater;








