import path from 'path';
import fs from 'fs';
import config from '../config';
const { logger } = config;

export function copyFile(from: string, to: string): void {
    try {
        fs.copyFileSync(from, to);
    }
    catch (exc) {
        logger(`Error while copying file ${from} to ${to}. filename: ${__dirname}.\r\nError: ${exc}`);
    }
}


