const fs = require('fs');
const path = require('path');

const check = async (directory) => {
    try {
        let currentDir = directory.split(path.sep);
        return currentDir;
    } catch(error) {
        throw new Error(error);
    }
    
}

module.exports = check;