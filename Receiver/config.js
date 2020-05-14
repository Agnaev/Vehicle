const config = require('../config');
const path = require('path');

const local_config = {
    ...config,
    basedir: __dirname,
    debug: true,
    error_handler_404: void 0
};

local_config.error_handler_404 = (res, exc) => {
    res.status(404).render(
        path.join(local_config.basedir, 'View', '404.hbs'),
        {
            exc: local_config.debug && isEmptyObject(exc) ? exc : 'Произошла неизвестная ошибка'
        }
    )
};

function isEmptyObject(obj) {
    for (const item in obj) {
        if(obj.hasOwnProperty(item)) {
            return true;
        }
    }
    return false;
}

module.exports = local_config;
