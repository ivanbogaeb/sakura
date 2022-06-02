class Sakupdater {
    constructor(){
        // Imports
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
        // Functions
        this.latest = async () => {
            let tagname = await latest(this.gitUsername, this.gitRepository, this.currentVersion, this.downloadVersion);
            newVersion = tagname;
            return tagname;
        };
        this.download = async () => {return await download(this.gitUsername, this.gitRepository, this.privateToken, this.installationDirectory, newVersion)};
        this.update = async () => {return await update(this.installationDirectory, newVersion, this.hasEXEFile)};
    };
};

module.exports = Sakupdater;








