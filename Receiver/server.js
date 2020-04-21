// @ts-check

const express                       = require('express')
const bodyParser                    = require('body-parser')
const path                          = require('path')
const {makeRequest}                 = require('./db/makeRequest')
const {port, ip, web_socket_port}   = require('../config')

const app = express();

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, 'View')));

app.get('/', (req, res) => {
    const fileName = path.join(__dirname, 'View', 'Index.html');
    res.sendFile(fileName);
})

app.get('/get_socket_port', (req, res) => {
    res.send({
        port: web_socket_port
    });
})

app.post('/get_metrics', async (req, res) => {
    const data = await makeRequest('SELECT * FROM MetricsTypes');
    res.send(data.recordset);
})

app.listen(port, ip);


