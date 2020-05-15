import { Router, Response, Request } from 'express';
import config from '../config';
import * as values from '../db/metrics_values';

const { logger } = config;

const router = Router();

function local_logger(res: Response, action: string, exc: Error) {
    logger(`Error while ${action} metrics values. filename: ${__dirname}.\r\nError${exc}`);
    res.sendStatus(500);
}

router.get('/', (req: Request, res: Response): void => {
    values.Get()
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'getting'))
});

router.post('/', (req: Request, res: Response): void => {
    values.Create(req.body)
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'adding'))
});

router.delete('/', (req: Request, res: Response): void => {
    values.Delete()
        .then(() => res.sendStatus(200))
        .catch(local_logger.bind(null, res, 'deleting'))
});

export default router;