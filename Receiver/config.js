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
            exc: local_config.debug && Object.keys(exc).length ? exc : 'Произошла неизвестная ошибка'
        }
    )
};

module.exports = local_config;
