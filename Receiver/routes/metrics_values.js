const { Router } = require('express');
const { logger, basedir } = require('../config');
const {Create, Delete, Get} = require('../db/metrics_values');
const path = require('path');

const router = Router();

router.get('/get', async (req, res) => {
    try {
        const data = await Get();
        res.status(200).send(data);
    }
    catch(exc) {
        logget(`Error while getting metrics values from database. filename: ${__dirname}.\r\nError${exc}`);
        res.sendStatus(500);
    }
})

router.post('/create', async (req, res) => {
    try {
        const result = await Create(req.body);
        res.send(result);
    }
    catch (exc){
        logger(`Error while adding metrics values to database. filename: ${__dirname}.\r\nError: ${exc}`)
        res.sendStatus(500);
    }
})

router.post('/delete', async (req, res) => {
    try {
        const result = await Delete();
        res.send(result);
    }
    catch(exc) {
        logger(`Error while deleting metrics values. filename: ${__dirname}.\r\nError: ${exc}`);
        res.sendStatus(500);
    }
})

module.exports = router;