// @ts-check
'use strict';

const { Router } = require('express');
const { Delete,
    Update,
    Create,
    GetMetrics } = require('../db/types');
const { logger } = require('../config');

const router = Router();
router.delete('/', async (req, res) => {
    try {
        await Delete(req.body);
        res.sendStatus(200);
    }
    catch (exc) {
        logger('Error processing request delete metric\r\nfilename:', __dirname, exc);
        res.sendStatus(500);
    }
});

router.put('/', async (req, res) => {
    try {
        const data = await Update(req.body);
        res.status(200).send(data);
    }
    catch (exc) {
        logger('Error processing request update metric\r\nfilename', __dirname, exc);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await Create(req.body);
        res.status(200).send(data);
    }
    catch (exc) {
        logger('Error processing request create metric\r\nfilename: ', __dirname, exc);
        res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await GetMetrics();
        res.status(200).send(data);
    }
    catch (exc) {
        logger(`Error processing request get metric\r\nfilename: ${__dirname}`, exc);
        res.sendStatus(500);
    }
});

module.exports = router;

