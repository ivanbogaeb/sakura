<br>
<p align="center"><img align="center" alt="GitHub forks" width="800" src="./sakura-logo.png"></p>
<br>
<h2 align="center">Bringing you an easy, simple, spring like fresh start on Electron and Node.JS updaters.</h2>
<hr>
<p align="center">
<a href="https://github.com/ivanbogaeb/sakura/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/ivanbogaeb/sakura"></a>
<a href="https://github.com/ivanbogaeb/sakura/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ivanbogaeb/sakura"></a>
<a href="https://github.com/ivanbogaeb/sakura/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/ivanbogaeb/sakura"></a>
<a href="https://github.com/ivanbogaeb/sakura/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/ivanbogaeb/sakura"></a>
</p>

<br>

## What is Sakura?
Sakura is a minimal Electron and Node.JS auto-updater, offering developers high flexibility and modularity to work on from within their own code.

<br>

## Features:
- File checks.
- Splash screen. *(Electron only)*
- Automatic updates.
- Customizable alert *(Electron only)*
- Latest version available.
- Latest version downloader.
- Private and public repository access.

<br>

## To-do:
- [ ] Linux and iOS support.
- [ ] Relaunch command on Node.JS apps.
    *(Currently Node.JS apps cannot execute themselves once updated)*

<br>

## Installation:

```console
npm install @ivanbogaeb/sakura
```

> Keep in mind that currently only Windows is fully supported.

<br>

## Example:

```javascript
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
            executableName: 'steroid.exe',
            isElectron: true, // Sakura works both for Electron and Node.JS
            currentVersion: require('./version.json'), // Load your current version from a file
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

```

<br>

## Reference:

- [Import](#import)
- [Settings](#settings)
- [Functions](#functions)
    - [Ready()](#ready)
    - [Check()](#check)
    - [Latest()](#latest)
    - [Download()](#download)
    - [Update()](#update)
    - [Splash()](#splash)
    - [Close()](#close)
    - [Messenger()](#messenger)
- [Splash screen](#splash-screen)

### Import
You can simply import sakura as CommonJS module or ES, it doesn't matter!

- **CommonJS**:
    ```javascript
    const Sakura = require('@ivanbogaeb/sakura');
    ```
- **ES Module**:
    ```javascript
    import Sakura from '@ivanbogaeb/sakura';
    ```

### Settings
Sakura is completely customizable, in fact, you can use it's modules independently.

```javascript
let sakura = new Sakura({
    gitUsername: '', // Github username
    gitRepository: '', // Github repository
    privateToken: '', // ONLY FOR PRIVATE REPOSITORIES
    installationDirectory: path.join(__dirname, '../'), // Your main app directory
    hasExecutable: true/false, // Toggle on if you require to restart your application
    executableName: 'APP-NAME.exe', // Name of your main EXE file
    isElectron: true/false, // Sakura works both for Electron and Node.JS
    messages: {
        splash: 'Loading...', // Initial message
        fetching: 'Checking for updates...', // While looking for updates
        downloading: 'Downloading new update...', // When your app is downloading
        updating: 'Updating...' // While it's updating
    },
    currentVersion: require('./version.json'), // Load your current version from a file, variable or string!
});
```

### Functions
With this module you have the options to automate the process or take control on your own!

#### **`ready()`** (Recommended)
Auto-updater function, it does all the process for you.
```javascript
let isReady = await sakura.ready(); // Returns true once the app has been updated or found it is up to date.
if (isReady){
    // Continue normal process
};
```

#### **`check()`**
Will check if you are running an update instance. If that's so, it will replace the old version with the new one and execute itself again.
```javascript
let isNotUpdate = await sakura.check(); // Returns true if it's not an update
if (isNotUpdate){
    // Continue normal process
};
```

#### **`latest()`**
Returns the latest version available.
```javascript
let latestVersion = await sakura.latest(); // Returns version string
```

#### **`download()`**
Creates an "Updates" folder inside your main application and downloads the latest version.
> Must be used along [latest()](#latest). This is because Sakura has a micro internal cache where it stores the current version you are working on and also the latest, including a download URL.
```javascript
await sakura.latest(); // Returns version string
let download = await sakura.download();
if (download){
    // Do something after it has been downloaded
};
```

#### **`update()`**
Updates your main application based on the latest version you downloaded.
> Must be used along [latest()](#latest) and [download()](#download).
```javascript
await sakura.latest(); // Returns version string
let download = await sakura.download();
if (download){
    await sakura.update();
};
```

#### **`splash()`** (Electron only)
Executes a splash screen of your choice.
```javascript
let splash = await sakura.splash(windowProperties, HTMLFile);
```

#### **`close()`** (Electron only)
Closes the splash screen.
```javascript
await sakura.close();
```

#### **`messenger()`** (Electron only) (Not recommended to use)
Talks to the splash screen by sending information throught actions.

**Types**:
- `activate`: Window you want to send information to throught [webContents](https://www.electronjs.org/es/docs/latest/api/web-contents).
    > Must be used with `window` type of Payload.
- `message`: Sends information to the splash screen.

**Payload**:
- `window`: [BrowserWindow](https://www.electronjs.org/es/docs/latest/api/browser-window) you want to connect to display updates information.
- `message`: This payload has four properties embed: `type`, `text`, `loader` and `percentage`.

**Message payload**:
```javascript
{
    type: 0, // Type 0 for messages, type 1 for downloads
    text: "This is an important updater message",
    loader: {
        active: false, // You can set a loader bar on and off
        data: 0, // Progress in kb
        total: 0, // Total size in kb
    }
}
```
```javascript
let message = await sakura.messenger({
    type: 'message',
    payload: {type: 0, text: "This is an important updater message", loader: {active: false, data: 0, total: 0}}
}); // Prints on the splash screen the text!

let message = await sakura.messenger({
    type: 'message',
    payload: {type: 1, text: "Downloading update...", loader: {active: true, data: 900, total: 1000}}
}); // Prints on the splash screen the text, activates the percentage bar to 90% completed.
```

### Splash Screen
Sakura communicates straight to the splash screen using [webContents](https://www.electronjs.org/es/docs/latest/api/web-contents). This way, you will be able to customize where you want updates information, how and which window.

- Create your own HTML, CSS and JavaScript files.
- Inside your JavaScript file, you will have to implement this code:
    ```javascript
    const { ipcRenderer } = require('electron');
    window.onload = async () => {
        ipcRenderer.on('SakuraUpdater', (event, message) => {
            /*
                Message contains:
                {
                    text: "Message you sent from sakura",
                    loader: {
                        active: true/false,
                        data: 0,
                        total: 0
                        percentage: 0 to 100
                    }
                }

            */
            document.getElementById('download-label').innerText = message.text; // Sakura message updates the download label text
            if (message.loader.active){
                document.getElementById('bar-progress').style.width = message.loader.percentage + '%'; // Progress bar using CSS properties
            };
        });
    };
    ```
- Setup your splash screen settings:
    ```javascript
    let splashScreenProperties = {
        show: true,
        frame: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        width: 400,
        height: 250,
        center: true,
        webPreferences: {
            webSecurity: true,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), './render/scripts/updater.js')
        },
        icon: path.join(__dirname, '../favicon.ico')
    };
    ```
- Create a splash screen executing [Splash()](#splash-electron-only).

<br>

## Changelog:
- 20 July 2022 - First "Release" - Version 0.9.0
- **[Read more...](./CHANGELOG.md)**

<br>

## Credits:
- Inspired by **[UAUP-JS](https://github.com/DcmanProductions/UAUP-JS)**.

<br>

## License:
**[CC0 1.0 Universal](./LICENSE)**
