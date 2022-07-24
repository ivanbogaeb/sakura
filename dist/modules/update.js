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
const update = (path, AdmZip, spawn, windowMessenger, isElectron, messages, installationDirectory, version, hasEXEFile, exeFile) => __awaiter(void 0, void 0, void 0, function* () {
    if (installationDirectory == '') {
        throw new Error('You must introduce an installation directory in order to update your version.');
    }
    ;
    if (version == '') {
        throw new Error('You need to fetch the latest version information first in order to request an update.');
    }
    ;
    try {
        let data = yield windowMessenger(isElectron, { type: 'message', payload: { type: 0, text: messages.updating, loader: { active: false, data: 0, total: 0, percentage: 0 } } });
        if (data) {
            const zipper = new AdmZip(path.join(installationDirectory, `/updates/${version}.zip`));
            if (!hasEXEFile) {
                zipper.extractAllTo(path.join(installationDirectory, ''));
                return true;
            }
            else {
                let updateDir = path.join(installationDirectory, `/updates/${version}`);
                zipper.extractAllTo(updateDir);
                if (isElectron) {
                    const newInstance = spawn(path.join(updateDir, `./${exeFile}`), {
                        cwd: installationDirectory,
                        detached: true,
                        stdio: 'ignore',
                    });
                    newInstance.unref();
                    process.exit(0);
                }
                else {
                    return true;
                }
            }
            ;
        }
        ;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
    ;
});
module.exports = update;
