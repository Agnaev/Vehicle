// @ts-check

'use strict'

const express                       = require('express');
const bodyParser                    = require('body-parser');
const path                          = require('path');
const {DatabaseCheck}               = require('./db/db_connection');
const {
    port, 
    ip, 
    web_socket_port,
    logger}                         = require('../config');
const types                         = require('./db/types');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, 'View')));

app.get('/', (req, res) => {
    const fileName = path.join(__dirname, 'View', 'Index.html');
    res.sendFile(fileName);
})

app.get('/metrics', (req, res) => {
    const fileName = path.join(__dirname, 'View', 'Metrics.html');
    res.sendFile(fileName);
})

app.get('/get_socket_port', (req, res) => {
    res.send({
        port: web_socket_port
    });
})

app.get('/get_metrics', async (req, res) => {
    const data = await types.GetMetrics();
    res.send(data.recordset);
})

app.post('/create_metric', async (req, res) => {
    try{
        const data = await types.Create(req.body);
        res.send(data);
    }
    catch(exc) {
        logger('Error processing request /crate_metric', exc)
        res.sendStatus(500)
    }
})

app.post('/delete_metric', async (req, res) => {
    try{
        await types.Delete(req.body)
        res.sendStatus(200)
    } 
    catch(exc) {
        logger('Error processing request /delete_metric', exc)
        res.sendStatus(500)
    }
})

app.post('/update_metric', async (req, res) => {
    try{
        const data = await types.Update(req.body)
        res.send(data)
    }
    catch(exc) {
        logger('Error processing request /update_metric', exc)
        res.sendStatus(500)
    }
})

app.listen(port, ip, async () => {
    try{
        await DatabaseCheck()
        logger('server has been started...')
    }
    catch(exc){
        logger('Application running error', exc);
        process.exit(1);
    }
})


