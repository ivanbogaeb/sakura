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
const check = (path, spawn, timer, windowMessenger, isElectron, messages, installationDirectory, fileEXEName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield windowMessenger(isElectron, { type: 'message', payload: { type: 0, text: messages.splash, loader: { active: false, data: 0, total: 0, percentage: 0 } } });
        yield timer(1000);
        if (data) {
            let currentDir = installationDirectory.split(path.sep);
            let isUpdateDir = currentDir.find((element, index) => {
                if (element.includes('updates')) {
                    return index;
                }
                ;
            });
            if (isUpdateDir !== undefined) {
                data = yield windowMessenger(isElectron, { type: 'message', payload: { type: 0, text: messages.updating, loader: { active: false, data: 0, total: 0, percentage: 0 } } });
                yield timer(1000);
                let mainDirectory = '';
                if (isElectron) {
                    mainDirectory = path.join(installationDirectory, '../../../../../../');
                }
                else {
                    mainDirectory = path.join(installationDirectory, '../../');
                }
                ;
                let consoleCommand = '';
                if (process.platform == 'win32') {
                    consoleCommand = spawn('cmd', ['/c', 'robocopy', `${path.join(installationDirectory, '../../')}`, `${mainDirectory}`, '/E', '/IS', '/IT', '/IM']);
                }
                else {
                    consoleCommand = spawn('bash', ['/c', 'cp', '-r', `${path.join(installationDirectory, '../../')}`, `${mainDirectory}`]);
                }
                ;
                if (isElectron) {
                    consoleCommand.on('exit', () => {
                        const child = spawn(path.join(mainDirectory, `./${fileEXEName}`), {
                            cwd: installationDirectory,
                            detached: true,
                            stdio: 'ignore'
                        });
                        child.unref();
                        process.exit(0);
                    });
                }
                ;
            }
            ;
            return true;
        }
        ;
    }
    catch (error) {
        throw new Error(error);
    }
    ;
});
module.exports = check;
