const path = require('path');
const { spawn } = require('child_process');
const timer = require('./timer');


const check = async (windowMessenger, isElectron, messages, installationDirectory, fileEXEName) => {
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 0, text: messages.splash, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        await timer(1000);
        if (data){
            let currentDir = installationDirectory.split(path.sep);
            let match = currentDir.find(element => {
                if (element.includes('updates')) {
                    return true;
                }
            });
            if (match){
                data = await windowMessenger(isElectron, {type: 'message', payload: {type: 0, text: messages.updating, loader: {active: false, data: 0, total: 0, percentage: 0}}});
                await timer(1000);
                let mainDirectory = path.join(installationDirectory, '../../../../../../');
                const consoleCommand = spawn('cmd', ['/c', 'robocopy', `${path.join(installationDirectory, '../../')}`, `${mainDirectory}`, '/E', '/IS', '/IT', '/IM']);
                consoleCommand.on('exit', () => {
                    const child = spawn(path.join(mainDirectory, `./${fileEXEName}`), {
                        cwd: installationDirectory,
                        detached: true,
                        stdio: 'ignore'
                    });
                    child.unref();
                    process.exit(0);
                }); 
            };
            return true;
        };
    } catch(error) {
        throw new Error(error);
    };
};

module.exports = check;