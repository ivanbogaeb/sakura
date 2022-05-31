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

        // Versioning
        this.currentVersion = '';

        // Functions
        this.latest = async () => {return await latest(this.gitUsername, this.gitRepository, this.currentVersion)};
        this.download = async () => {return await download(this.gitUsername, this.gitRepository, this.privateToken, this.newVersion)};
        this.update = async () => {return await update()};
        // this.getCurrentVersion = async () => {await current()};
    };
};

module.exports = Sakupdater;








