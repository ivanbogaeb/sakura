class SakuraUpdater {
    constructor({
        gitUsername = '',
        gitRepository = '',
        privateToken = '',
        installationDirectory = '',
        hasEXEFile = true,
        fileEXEName = '',
        isElectron = true,
        messages = {
            splash: 'Loading...',
            fetching: 'Checking for updates...',
            downloading: 'Downloading new update...',
            updating: 'Updating...'
        },
        currentVersion = ''
    }){
        // Imports
        const check = require('./modules/check'); // Update checker, if we are running an update, it will instantly replace the old app with the new version.
        const ready = require('./modules/ready'); // Automatic update check, installation and run.
        const latest = require('./modules/latest'); // Get latest version available.
        const update = require('./modules/update'); // Extracts the downloaded app, runs it and closes the old version.
        const download = require('./modules/download'); // Downloads the latest version if available.
        const {windowMessenger, windowCreator, windowClose} = require('./modules/window'); // Information handler that connects the Sakura Browser Window and Application safely.

        // Settings
        this.gitUsername = gitUsername; // Github username to fetch repos
        this.gitRepository = gitRepository; // Github repository of your app
        this.privateToken = privateToken; // Your private token, here you can get yours: https://github.com/settings/tokens (DON'T USE THIS ON PRODUCTION)
        this.installationDirectory = installationDirectory; // Main app installation directory (Just in case if you are not using electron)
        this.hasEXEFile = hasEXEFile; // If you need to also update an EXE file, use this function to halt them
        this.fileEXEName = fileEXEName; // Main EXE file that needs to be executed
        this.isElectron = isElectron; // If you are running an Electron application!

        // Messages
        this.messages = messages;

        // Versioning
        this.currentVersion = currentVersion; // Current version of your program
        let newVersion = ''; // This is exclusively for internal use
        let downloadURL = ''; // Download URL of your release

        // Functions
        this.run = async (properties, HTMLFile) => {
            return await windowCreator(this.isElectron, properties, HTMLFile);
        };
        this.check = async () => {
            return await check(windowMessenger, this.isElectron, this.messages, this.installationDirectory, this.fileEXEName);
        };
        this.latest = async () => {
            let {tagname, url} = await latest(windowMessenger, this.isElectron, this.messages, this.gitUsername, this.gitRepository, this.privateToken);
            newVersion = tagname;
            downloadURL = url;
            return tagname;
        };
        this.download = async () => {
            if (this.currentVersion !== newVersion){
                return await download(windowMessenger, this.isElectron, this.messages, downloadURL, this.privateToken, this.installationDirectory, newVersion);
            } else {
                return false;
            };   
        };
        this.update = async () => {
            if (this.currentVersion !== newVersion){
                return await update(windowMessenger, this.isElectron, this.messages, this.installationDirectory, newVersion, this.hasEXEFile, this.fileEXEName);
            } else {
                return false;
            };
        };
        this.close = () => {
            windowClose(this.isElectron);
        };
        this.ready = async (windowProperties, HTMLFile) => {
            return await ready(windowProperties, HTMLFile, this.run, this.check, this.latest, this.download, this.update, this.close, this.currentVersion);
        };
    };
};

module.exports = SakuraUpdater;