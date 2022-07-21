

const check = async (path:any, spawn:any, timer:any, windowMessenger:any, isElectron:boolean, messages:any, installationDirectory:string, fileEXEName:string) => {
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 0, text: messages.splash, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        await timer(1000);
        if (data){
            let currentDir = installationDirectory.split(path.sep);
            let isUpdateDir = currentDir.find((element, index) => {
                if (element.includes('updates')){
                    return index;
                };
            });
            if (isUpdateDir !== undefined){
                data = await windowMessenger(isElectron, {type: 'message', payload: {type: 0, text: messages.updating, loader: {active: false, data: 0, total: 0, percentage: 0}}});
                await timer(1000);
                let mainDirectory = '';
                if (isElectron){
                    mainDirectory = path.join(installationDirectory, '../../../../../../');
                } else {
                    mainDirectory = path.join(installationDirectory, '../../');
                }
                let consoleCommand:any = '';
                if (process.platform == 'win32'){
                    consoleCommand = spawn('cmd', ['/c', 'robocopy', `${path.join(installationDirectory, '../../')}`, `${mainDirectory}`, '/E', '/IS', '/IT', '/IM']);
                } else {
                    consoleCommand = spawn('bash', ['/c', 'cp', '-r', `${path.join(installationDirectory, '../../')}`, `${mainDirectory}`]);
                };
                if (isElectron){
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
            };
            return true;
        };
    } catch(error:any) {
        throw new Error(error);
    };
};

module.exports = check;