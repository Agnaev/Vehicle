// @ts-check
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { DatabaseCheck } = require('./db/db_connection');
const {
    port,
    ip,
    logger,
    basedir,
    error_handler_404 } = require('./config');
const routers = require('./routes/router');
const { copyFile } = require('./helper/helper');

const app = express();

app.set("view engine", "hbs");

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(
    express.static(
        path.join(basedir, 'View')
    )
);

app.use((req, res, next) => {
    logger(`middleware ${req.method} ${req.path}`);
    next();
});
app.use('/api/metric_values', routers.values);
app.use('/api/metrics', routers.types);
app.use('/api/cards', routers.partials);
app.use('/', routers.main);

app.use((req, res) => {
    logger(`Client with ip: ${req.ip} got 404 error with request: ${req.originalUrl}`);
    error_handler_404(res, 'Страница не найдена.')
});

app.listen(port, ip, async () => {
    try {
        const isRelease = process.argv.splice(2).includes('release');
        const db_check = DatabaseCheck();

        copyFile(
            path.join(basedir, 'node_modules', 'jquery', 'dist', 'jquery.min.js'),
            path.join(basedir, 'View', 'scripts', 'jquery.min.js')
        );

        await db_check;
        logger(`server has been started at ${ip}:${port}.`);
    }
    catch (exc) {
        logger('Error starting application.', exc);
        process.exit(1);
    }
});


