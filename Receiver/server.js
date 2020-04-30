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
    web_socket_port,
    logger}             = require('../config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'View')));
app.use((req, res, next) => {
    logger(`middleware ${req.method} ${req.path}`);
    next();
});
app.use('/api/metrics', require('./routes/metrics_api'));

app.get('/', (req, res) => {
    const fileName = path.join(__dirname, 'View', 'Index.html');
    res.sendFile(fileName);
});

app.get('/metrics', (req, res) => {
    const fileName = path.join(__dirname, 'View', 'Metrics.html');
    res.sendFile(fileName);
});

app.get('/api/get_socket_port', (req, res) => {
    res.send({
        port: web_socket_port
    });
});

app.get('/api/get_images_list', (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, 'View', 'images'));
    res.send(files);
});

app.listen(port, ip, async () => {
    try {
        const db_check = DatabaseCheck();
        fs.createReadStream('./node_modules/jquery/dist/jquery.min.js').pipe(
            fs.createWriteStream('./View/scripts/jquery.min.js')
        );
        await db_check;
        logger('server has been started...');
    }
    catch(exc) {
        logger('Error starting application.', exc);
        process.exit(1);
    }
});


