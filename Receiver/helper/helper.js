const path = require('path');
const fs = require('fs');
const { logger } = require('../config')

const copyFile = (from, to) => {
    try {
        fs.copyFileSync(from, to);
    }
    catch (exc) {
        logger(`Error while copying file ${from} to ${to}. filename: ${__dirname}.\r\nError: ${exc}`);
    }
}

module.exports = {
    copyFile
}
