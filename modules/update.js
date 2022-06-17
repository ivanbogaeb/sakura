const path = require('path');
const AdmZip = require('adm-zip');
const { spawn } = require('child_process');

const update = async (windowMessenger, isElectron, messages, installationDirectory, version, hasEXEFile, exeFile) => {
    if (installationDirectory == ''){
        throw new Error('You must introduce an installation directory in order to update your version.');
    };
    if (version == ''){
        throw new Error('You need to fetch the latest version information first in order to request an update.');
    };
    try {
        let data = await windowMessenger(isElectron, {type: 'message', payload: {type: 3, text: messages.updating, loader: {active: false, data: 0, total: 0, percentage: 0}}});
        if (data){
            const zipper = new AdmZip(path.join(installationDirectory, `/updates/${version}.zip`));
            if (!hasEXEFile){
                zipper.extractAllTo(path.join(installationDirectory, ''));
                return true;
            } else {
                let updateDir = path.join(installationDirectory, `/updates/${version}`);
                zipper.extractAllTo(updateDir);
                const newInstance = spawn(path.join(updateDir, `./${exeFile}`), {
                    cwd: installationDirectory,
                    detached: true,
                    stdio: 'ignore',
                });
                newInstance.unref();
                process.exit(0);
            };
        };
    } catch (error){
        console.log(error);
        throw new Error(error);
    };
};

module.exports = update;