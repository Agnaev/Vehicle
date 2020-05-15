const { Router } = require('express');
const { logger } = require('../config');
const values = require('../db/metrics_values');

const router = Router();

function local_logger(res, action, exc) {
    logger(`Error while ${action} metrics values. filename: ${__dirname}.\r\nError${exc}`);
    res.sendStatus(500);
}

router.get('/', (req, res) =>
    values.Get()
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'getting'))
)

router.post('/', (req, res) =>
    values.Create(req.body)
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'adding'))
);

router.delete('/', (req, res) =>
    values.Delete()
        .then(() => res.sendStatus(200))
        .catch(local_logger.bind(null, res, 'deleting'))
);

module.exports = router;