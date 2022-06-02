const path = require('path');
const AdmZip = require('adm-zip');
const { spawn } = require('child_process');


const update = async (installationDirectory, version, hasEXEFile) => {
    if (installationDirectory == ''){
        throw new Error('You must introduce an installation directory in order to update your version.');
    };
    if (version == ''){
        throw new Error('You need to fetch the latest version information first in order to request an update.');
    };

    try {
        const zipper = new AdmZip(path.join(installationDirectory, `/updates/${version}.zip`));
        if (!hasEXEFile){
            zipper.extractAllTo(path.join(installationDirectory, ''));
            return true;
        } else {
            let updateDir = path.join(installationDirectory, `/updates/${version}`);
            let installDir = path.join(installationDirectory, '');
            zipper.extractAllTo(updateDir);

            const consoleCommand = spawn('cmd', ['/c', 'robocopy', `${updateDir}`, `${installDir}`, '/E', '/IS', '/IT', '/IM'], {
                cwd: installDir,
                detached: true,
                stdio: 'ignore',
            });
            consoleCommand.unref();
            process.exitCode = 0;
        };
    } catch (error){
        throw new Error(error);
    };
};

module.exports = update;