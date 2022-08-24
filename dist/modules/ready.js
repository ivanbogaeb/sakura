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
const ready = (compare, windowProperties, HTMLFile, splash, check, latest, download, update, close, currentVersion) => __awaiter(void 0, void 0, void 0, function* () {
    let ready = yield splash(windowProperties, HTMLFile);
    if (ready) {
        let mainVersion = yield check();
        if (mainVersion) {
            let latestVersion = Object.create(yield latest());
            if (!latestVersion.hasOwnProperty.call('error')) {
                if (compare(latestVersion, currentVersion, '>')) {
                    let downloadLatestVersion = yield download();
                    if (downloadLatestVersion) {
                        yield update();
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
        close();
        return true;
    }
    ;
});
module.exports = ready;
