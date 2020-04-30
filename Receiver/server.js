// @ts-check
'use strict'

const express           = require('express');
const bodyParser        = require('body-parser');
const path              = require('path');
const fs                = require('fs');
const {DatabaseCheck}   = require('./db/db_connection');
const {
    port, 
    ip, 
    logger,
    basedir,
    error_handler_404}  = require('./config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(basedir, 'View')));
app.use((req, res, next) => {
    logger(`middleware ${req.method} ${req.path}`);
    next();
});

app.set("view engine", "hbs");

app.use('/api/metrics', require('./routes/metrics_api'));
app.use('/',            require('./routes/main_routes'));
app.use((req, res) => 
    error_handler_404(res, 'Страница не найдена.')
);

app.listen(port, ip, async () => {
    try {
        const db_check = DatabaseCheck();
        fs.createReadStream (
            path.join(basedir, 'node_modules', 'jquery', 'dist', 'jquery.min.js')
        ).pipe (
            fs.createWriteStream (
                path.join(basedir, 'View', 'scripts', 'jquery.min.js')
            )
        );
        await db_check;
        logger('server has been started...');
    }
    catch(exc) {
        logger('Error starting application.', exc);
        process.exit(1);
    }
});


