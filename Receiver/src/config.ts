const config = require('../config');
import path from 'path';
import { Response } from 'express'

const local_config = {
    ...config,
    debug: true,
    error_handler_404: void 0
};

local_config.error_handler_404 = (res: Response, exc: Error): void => {
    res.status(404).render(
        path.join(local_config.basedir, 'View', '404.hbs'),
        {
            exc: local_config.debug && isEmptyObject(exc) ? exc : 'Произошла неизвестная ошибка'
        }
    )
};

function isEmptyObject(obj: object): boolean {
    for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
            return true;
        }
    }
    return false;
}

export default local_config;
