const AdmZip = require('adm-zip');
const path = require('path');

const update = async () => {
    try {
        const zipper = new AdmZip(path.join(__dirname, '../updates/OrbWeaver-v1.1.0-release.zip'));
        zipper.extractAllTo(path.join(__dirname, '../updates/OrbWeaver-v1.1.0-release'));
        return true;
    } catch (error){
        throw new Error(error);
    };
};

module.exports = update;