<h1 align="center">Sakura</h1>
<p align="center">Sakura auto-updater, connected to github!</p>

<hr>

<p align="center">
<a href="https://github.com/ivanbogaeb/sakupdater/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/ivanbogaeb/sakupdater"></a>
<a href="https://github.com/ivanbogaeb/sakupdater/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ivanbogaeb/sakupdater"></a>
<a href="https://github.com/ivanbogaeb/sakupdater/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/ivanbogaeb/sakupdater"></a>
<a href="https://github.com/ivanbogaeb/sakupdater/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/ivanbogaeb/sakupdater"></a>
</p>

<br>

## What is sakupdater?

Sakupdater is a neat tool to create your own auto-updater system based on Github, without having to smash your head against the keyboard, saving you all the suffering.

## Features:

- Get latest version available.
- Get current version.
- Update your stuff **(Not even finished)**

## Installation:

```console
    no installation yet
```

## Usage:

```javascript
const Sakupdater = require('../index.js');
let updater = new Sakupdater();

async function runAutoupdater(){

    updater.gitUsername = 'ivanbogaeb';
    updater.gitRepository = 'OrbWeaver';
    // updater.privateToken = 'YOUR REPOSITORY PRIVATE TOKEN HERE';

    let getLatestVersion = await updater.getLatestVersion(); // Returns latest version
    let downloadLatestVersion = await updater.downloadLatestVersion(); // Downloads latest version and when done returns 'true'
    
    console.log(getLatestVersion);
    console.log(downloadLatestVersion);
    
    let update = await updater.update(); // Updates your program automatically...
};

runAutoupdater();
```

## Things to consider:
- THIS SOFTWARE IS NOT EVEN COMPLETED, SO DON'T DOWNLOAD IT

## Changelog:
- 29 May 2022 - First "Release" - Version 0.6.0
- **[Read more...](./changelog.md)**

## Credits:

- Brought to you thanks to **ADD STUFF HERE BUT NOT TODAY**.
- Inspired by **[UAUP-JS](https://github.com/DcmanProductions/UAUP-JS)**.

## License:
**[CC0 1.0 Universal](./LICENSE)**
