"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
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
class Sakura {
    constructor({ gitUsername = '', gitRepository = '', privateToken = '', installationDirectory = '', hasExecutable = true, executableName = '', isElectron = true, messages = {
        splash: 'Loading...',
        fetching: 'Checking for updates...',
        downloading: 'Downloading new update...',
        updating: 'Updating...',
        unableToUpdate: 'Unable to update, skipping...'
    }, currentVersion = '' }) {
        const fs = require('fs');
        const path = require('path');
        const AdmZip = require('adm-zip');
        const axios = require('axios').default;
        const { spawn } = require('child_process');
        const { compare } = require("compare-versions");
        // Imports
        const timer = require('./modules/timer');
        const check = require('./modules/check'); // Update checker, if we are running an update, it will instantly replace the old app with the new version.
        const ready = require('./modules/ready'); // Automatic update check, installation and run.
        const latest = require('./modules/latest'); // Get latest version available.
        const update = require('./modules/update'); // Extracts the downloaded app, runs it and closes the old version.
        const download = require('./modules/download'); // Downloads the latest version if available.
        const { windowMessenger, windowCreator, windowClose } = require('./modules/window'); // Information handler that connects the Sakura Browser Window and Application safely.
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
        this.check = () => __awaiter(this, void 0, void 0, function* () {
            return yield check(path, spawn, timer, windowMessenger, this.isElectron, this.messages, this.installationDirectory, this.executableName);
        });
        this.latest = () => __awaiter(this, void 0, void 0, function* () {
            let data = yield latest(axios, timer, windowMessenger, this.isElectron, this.messages, this.gitUsername, this.gitRepository, this.privateToken);
            if (data.hasOwnProperty('tagname')) {
                newVersion = data.tagname;
                downloadURL = data.url;
                return data.tagname;
            }
            else {
                return currentVersion;
            }
        });
        this.download = () => __awaiter(this, void 0, void 0, function* () {
            return yield download(fs, path, axios, windowMessenger, this.isElectron, this.messages, downloadURL, this.privateToken, this.installationDirectory, newVersion);
        });
        this.update = () => __awaiter(this, void 0, void 0, function* () {
            if (this.currentVersion !== newVersion) {
                return yield update(path, AdmZip, spawn, windowMessenger, this.isElectron, this.messages, this.installationDirectory, newVersion, this.hasExecutable, this.executableName);
            }
            else {
                return false;
            }
            ;
        });
        this.splash = (windowProperties, HTMLFile) => __awaiter(this, void 0, void 0, function* () {
            return yield windowCreator(this.isElectron, windowProperties, HTMLFile);
        });
        this.close = () => {
            windowClose(this.isElectron);
        };
        this.messenger = (action) => __awaiter(this, void 0, void 0, function* () {
            yield windowMessenger(this.isElectron, action);
        });
        this.ready = (windowProperties, HTMLFile) => __awaiter(this, void 0, void 0, function* () {
            return yield ready(compare, windowProperties, HTMLFile, this.splash, this.check, this.latest, this.download, this.update, this.close, this.currentVersion);
        });
    }
    ;
}
;
module.exports = Sakura;
