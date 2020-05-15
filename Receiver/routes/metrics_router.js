// @ts-check
'use strict';

const { Router } = require('express');
const types = require('../db/types');
const { logger } = require('../config');

function local_logger(res, action, exc) {
    logger(`Error processing request ${action} metric\r\nfilename:`, __dirname, exc);
    res.sendStatus(500);
}

const router = Router();
router.delete('/', (req, res) =>
    types.Delete(req.body)
        .then(() => res.sendStatus(200))
        .catch(local_logger.bind(null, res, 'delete'))
);

router.put('/', (req, res) =>
    types.Update(req.body)
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'update'))
);

router.post('/', (req, res) =>
    types.Create(req.body)
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'create'))
);

router.get('/', (req, res) =>
    types.GetMetrics()
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'get'))
);

module.exports = router;

