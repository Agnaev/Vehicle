const { Router } = require('express');
const { logger } = require('../config');
const {Create, 
    Delete, 
    Get} = require('../db/metrics_values');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await Get();
        res.status(200).send(data);
    }
    catch(exc) {
        logget(`Error while getting metrics values from database. filename: ${__dirname}.\r\nError${exc}`);
        res.sendStatus(500);
    }
})

router.post('/', async (req, res) => {
    try {
        const result = await Create(req.body);
        res.status(200).send(result);
    }
    catch (exc){
        logger(`Error while adding metrics values to database. filename: ${__dirname}.\r\nError: ${exc}`)
        res.sendStatus(500);
    }
})

router.delete('/', async (req, res) => {
    try {
        const result = await Delete();
        res.status(200).send(result);
    }
    catch(exc) {
        logger(`Error while deleting metrics values. filename: ${__dirname}.\r\nError: ${exc}`);
        res.status(500).send(false);
    }
})

module.exports = router;