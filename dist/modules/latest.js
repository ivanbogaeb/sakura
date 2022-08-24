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
const latest = (axios, timer, windowMessenger, isElectron, messages, gitUsername, gitRepository, privateToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield windowMessenger(isElectron, { type: 'message', payload: { type: 1, text: messages.fetching, loader: { active: false, data: 0, total: 0, percentage: 0 } } });
        yield timer(2000);
        if (data) {
            let options = {
                method: 'GET',
                url: `https://api.github.com/repos/${gitUsername}/${gitRepository}/releases/latest`,
                responseType: 'json'
            };
            if (privateToken.length > 1) {
                options.headers = {
                    Authorization: `token ${privateToken}`
                };
            }
            ;
            try {
                const response = yield axios(options);
                try {
                    return { tagname: response.data.tag_name, url: response.data.assets[0].url };
                }
                catch (_a) {
                    yield windowMessenger(isElectron, { type: 'message', payload: { type: 1, text: "This repository must be private or doesn't exist, please check it's privileges.", loader: { active: false, data: 0, total: 0, percentage: 0 } } });
                    yield timer(2000);
                    return { error: "This repository must be private or doesn't exist, please check it's privileges.", code: 404 };
                }
                ;
            }
            catch (error) {
                yield windowMessenger(isElectron, { type: 'message', payload: { type: 1, text: "Unable to communicate with updating service, skipping update check...", loader: { active: false, data: 0, total: 0, percentage: 0 } } });
                yield timer(2000);
                return { error: "Unable to communicate with updating service, skipping update check...", code: 12002 };
            }
            ;
        }
        ;
    }
    catch (error) {
        throw new Error(error);
    }
    ;
});
module.exports = latest;
