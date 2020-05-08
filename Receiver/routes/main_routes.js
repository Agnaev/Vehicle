const { Router } = require('express');
const { logger,
    basedir,
    web_socket_port,
    error_handler_404 } = require('../config');
const fs = require('fs');
const path = require('path');

const router = Router();

router.get('/', (req, res) => {
    try {
        const fileName = path.join(basedir, 'View', 'Index.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger(`Error processing request '/'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
})

router.get('/values', async (req, res) => {
    try {
        res.sendFile(path.join(basedir, 'View', 'MetricsValues.html'));
    }
    catch(exc) {
        logger(`Error while getting metrics values from database. filename: ${__dirname}.\r\nError${exc}`);
        res.sendStatus(500);
    }
})

router.get('/metrics', (req, res) => {
    try {
        const fileName = path.join(basedir, 'View', 'Metrics.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger(`Error processing request '/metrics'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
});

router.get('/api/get_socket_port', (req, res) => {
    res.send({
        port: web_socket_port
    });
});

router.get('/api/get_images_list', (req, res) => {
    try {
        const files = fs.readdirSync (
            path.join(basedir, 'View', 'images')
        ).filter(file =>
            ['png', 'jpg', 'jpeg', 'svg']
                .includes (
                    path.extname(file).slice(1)
                )
        );
        res.send(files);
    }
    catch (exc) {
        logger(`Error processing request '/api/get_images_list'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
});

module.exports = router;