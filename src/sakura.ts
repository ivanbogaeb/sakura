interface ISakura {
    gitUsername: string,
    gitRepository: string,
    privateToken: string,
    installationDirectory: string,
    hasExecutable: boolean,
    executableName: string,
    isElectron: boolean,
    messages: {
        splash: string,
        fetching: string,
        downloading: string,
        updating: string
    },
    currentVersion: string
};

/**
* Sakura is a minimal Electron and Node.JS auto-updater, offering developers high flexibility and modularity to work on from within their own code.
* @example
* ```js
    const updated = async () => {
        const Sakura = require('@ivanbogaeb/sakura');
        try {
            let splashProperties = { // Create your own splash screen 👈
                show: true,
                frame: false,
                resizable: false,
                minimizable: false,
                maximizable: false,
                width: 400,
                height: 250,
                center: true,
                webPreferences: { // Sakura works under heavy security
                    webSecurity: true,
                    contextIsolation: true,
                    preload: path.join(app.getAppPath(), './render/scripts/updater.js') // Sakura splash screen code!
                },
                icon: path.join(__dirname, './favicon.ico')
            };
            
            let sakura = new Sakura({
                gitUsername: 'ivanbogaeb',
                gitRepository: 'sakura',
                privateToken: 'ghp_loOVMTQMpXz0K****************************', // If you are using a private repo!
                installationDirectory: path.join(__dirname, '../'), // Your main app directory
                hasExecutable: true, // Toggle on if you are executing EXE files
                executableName: 'SakuraApp.exe',
                isElectron: true, // Sakura works both for Electron and Node.JS
                currentVersion: require('./version.json'), // Load your current version from a file or text string
            });

            // Let sakura auto-updater do the magic! Returns true when done!
            return await sakura.ready(splashProperties, path.join(app.getAppPath(), './render/html/updater.html'));
            
        } catch (error){
            console.log(error);
            return false; // Unable to update
        };
    };

    if (updated){
        // LOAD MAIN APP
    };
* ```
*/
class Sakura implements ISakura {

    // Settings
    /**
     * Github username to fetch repos
     * @example
     * ```js
     * sakura.gitUsername = 'ivanbogaeb';
     * ```
    */
    gitUsername: string;
    /**
     * Github repository of your app
     * @example
     * ```js
     * sakura.gitRepository = 'sakura';
     * ```
    */
    gitRepository: string;
    /**
     * Your private token, here you can get yours: https://github.com/settings/tokens (DON'T USE THIS IN PRODUCTION)
     * @example
     * ```js
     * sakura.gitRepository = 'ghp_loOVMTQMpXz0K****************************';
     * ```
    */
    privateToken: string;
    /**
     * Main app installation directory (Just in case if you are not using electron)
     * @example
     * ```js
     * sakura.installationDirectory = path.join(__dirname, '../');
     * ```
    */
    installationDirectory: string;
    /**
     * If you need to also update an EXE file, use this function to halt them
     * @example
     * ```js
     * sakura.hasExecutable = true;
     * ```
    */
    hasExecutable: boolean;
    /**
     * Main EXE file that needs to be executed
     * @example
     * ```js
     * sakura.executableName = 'SakuraApp.exe';
     * ```
    */
    executableName: string;
    /**
     * If you are running an Electron application!
     * @example
     * ```js
     * sakura.isElectron = true;
     * ```
    */
    isElectron: boolean;
    /**
     * // Messages to be displayed on certain actions
    */
    messages: {
        splash: string;
        fetching: string;
        downloading: string;
        updating: string;
    };
    /**
     * // Current version of your program
     * @example
     * ```js
     * sakura.currentVersion = '1.0.0';
     * ```
    */
    currentVersion: string;
    /**
     * Will check if you are running an update instance. If that's so, it will replace the old version with the new one and execute itself again.
     * @example
    ```javascript
        let isNotUpdate = await sakura.check(); // Returns true if it's not an update
        if (isNotUpdate){
            // Continue normal process
        };
    ```
    */
    check: () => Promise<true>;
    /**
     * Returns the latest version available.
     * @example
    ```javascript
        let latestVersion = await sakura.latest(); // Returns version string
    ```
     * @url https://adasdas.com 
    */
    latest: () => Promise<any>;
    /**
     * Creates an "Updates" folder inside your main application and downloads the latest version.
     * @example
     * ```js
     *  await sakura.latest(); // Returns version string
        let download = await sakura.download();
        if (download){
            // Do something after it has been downloaded
        };
     * ```
    */
    download: () => Promise<boolean>;
    /**
     * Updates your main application based on the latest version you downloaded.
     * @example
     * ```js
     *  await sakura.latest(); // Returns version string
        let download = await sakura.download();
        if (download){
            await sakura.update();
        };
     * ```
    */
    update: () => Promise<any>;
    /**
     * Executes a splash screen of your choice.
     * @example
     * ```js
     * let splash = await sakura.splash(windowProperties, HTMLFile);
     * ```
    */
    splash: (windowProperties: object, HTMLFile: string) => Promise<any>;
    /**
     * Closes the splash screen.
     * @example
     * ```js
     * await sakura.close();
     * ```
    */
    close: () => void;
    /**
     * Talks to the splash screen by sending information throught actions.
     * @example
     * ```js
     *  let message = await sakura.messenger({
            type: 'message',
            payload: {type: 0, text: "This is an important updater message", loader: {active: false, data: 0, total: 0}}
        }); // Prints on the splash screen the text!

        let message = await sakura.messenger({
            type: 'message',
            payload: {type: 1, text: "Downloading update...", loader: {active: true, data: 900, total: 1000}}
        }); // Prints on the splash screen the text, activates the percentage bar to 90% completed.
     * ```
    */
    messenger: (action: object) => Promise<any>;
    /**
     * Auto-updater function, it does all the process for you.
     * @example
     * ```js
     *  let isReady = await sakura.ready(); // Returns true once the app has been updated or found it is up to date.
        if (isReady){
            // Continue normal process
        };
     * ```
    */
    ready: (windowProperties: object, HTMLFile: string) => Promise<any>;

    constructor({
        gitUsername = '',
        gitRepository = '',
        privateToken = '',
        installationDirectory = '',
        hasExecutable = true,
        executableName = '',
        isElectron = true,
        messages = {
            splash: 'Loading...',
            fetching: 'Checking for updates...',
            downloading: 'Downloading new update...',
            updating: 'Updating...'
        },
        currentVersion = ''
    }){
        const fs = require('fs');
        const path = require('path');
        const AdmZip = require('adm-zip');
        const axios = require('axios').default;
        const { spawn } = require('child_process');
        const { compare } = require("compare-versions");
        
        // Imports
        const timer = require('./timer');
        const check = require('./modules/check'); // Update checker, if we are running an update, it will instantly replace the old app with the new version.
        const ready = require('./modules/ready'); // Automatic update check, installation and run.
        const latest = require('./modules/latest'); // Get latest version available.
        const update = require('./modules/update'); // Extracts the downloaded app, runs it and closes the old version.
        const download = require('./modules/download'); // Downloads the latest version if available.
        const {windowMessenger, windowCreator, windowClose} = require('./modules/window'); // Information handler that connects the Sakura Browser Window and Application safely.

        // Settings
        this.gitUsername = gitUsername;
        this.gitRepository = gitRepository;
        this.privateToken = privateToken;
        this.installationDirectory = installationDirectory;
        this.hasExecutable = hasExecutable;
        this.executableName = executableName;
        this.isElectron = isElectron;

        // Messages
        this.messages = messages;

        // Versioning
        this.currentVersion = currentVersion;
        let newVersion = ''; // This is exclusively for internal use
        let downloadURL = ''; // Download URL of your release

        // Functions
        this.check = async () => {
            return await check(path, spawn, timer, windowMessenger, this.isElectron, this.messages, this.installationDirectory, this.executableName);
        };
        this.latest = async () => {
            let {tagname, url} = await latest(axios, timer, windowMessenger, this.isElectron, this.messages, this.gitUsername, this.gitRepository, this.privateToken);
            newVersion = tagname;
            downloadURL = url;
            return tagname;
        };
        this.download = async () => {
            return await download(fs, path, axios, windowMessenger, this.isElectron, this.messages, downloadURL, this.privateToken, this.installationDirectory, newVersion);
        };
        this.update = async () => {
            if (this.currentVersion !== newVersion){
                return await update(path, AdmZip, spawn, windowMessenger, this.isElectron, this.messages, this.installationDirectory, newVersion, this.hasExecutable, this.executableName);
            } else {
                return false;
            };
        };
        this.splash = async (windowProperties: object, HTMLFile: string) => {
            return await windowCreator(this.isElectron, windowProperties, HTMLFile);
        };
        this.close = () => {
            windowClose(this.isElectron);
        };
        this.messenger = async (action: object) => {
            await windowMessenger(this.isElectron, action);
        }
        this.ready = async (windowProperties, HTMLFile) => {
            return await ready(compare, windowProperties, HTMLFile, this.splash, this.check, this.latest, this.download, this.update, this.close, this.currentVersion);
        };
    };
};

module.exports = Sakura;