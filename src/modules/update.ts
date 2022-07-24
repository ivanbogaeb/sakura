const update = async (path:any, AdmZip:any, spawn:any, windowMessenger:any, isElectron:boolean, messages:any, installationDirectory:string, version:string, hasEXEFile:boolean, exeFile:string) => {
    if (installationDirectory == ''){
        throw new Error('You must introduce an installation directory in order to update your version.');
    };
    if (version == ''){
        throw new Error('You need to fetch the latest version information first in order to request an update.');
    };
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 0, text: messages.updating, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        if (data){
            const zipper = new AdmZip(path.join(installationDirectory, `/updates/${version}.zip`));
            if (!hasEXEFile){
                zipper.extractAllTo(path.join(installationDirectory, ''));
                return true;
            } else {
                let updateDir = path.join(installationDirectory, `/updates/${version}`);
                zipper.extractAllTo(updateDir);
                if (isElectron){
                    const newInstance = spawn(path.join(updateDir, `./${exeFile}`), {
                        cwd: installationDirectory,
                        detached: true,
                        stdio: 'ignore',
                    });
                    newInstance.unref();
                    process.exit(0);
                } else {
                    return true;
                }
            };
        };
    } catch (error:any){
        console.log(error);
        throw new Error(error);
    };
};

module.exports = update;