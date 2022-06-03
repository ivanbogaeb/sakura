const Sakupdater = require('../index.js');
const path = require('path');
let updater = new Sakupdater();

async function runAutoupdater(){
    updater.gitUsername = 'ivanbogaeb';
    updater.gitRepository = 'OrbWeaver';
    // updater.privateToken = 'YOUR REPOSITORY PRIVATE TOKEN HERE';

    updater.currentVersion = require('./version.json'); // Import the location of your version file
    console.log(updater.currentVersion);

    updater.installationDirectory = path.join(__dirname, './orbweaver');
    //updater.hasEXEFile = true; // If your app has an exe file or more being executed
    //updater.fileEXEName = 'steroid.exe'; // Main EXE file you need to run

    let isUpdate = await updater.check(__dirname);
    console.log(isUpdate);
    let getLatestVersion = await updater.latest(); // Returns latest version
    console.log(getLatestVersion);
    let downloadLatestVersion = await updater.download(); // Downloads latest version and when done returns 'true'
    console.log(downloadLatestVersion);
    
    let update = await updater.update(); // Downloads update, executes new version, stores old version, overwrites original files
};

runAutoupdater();