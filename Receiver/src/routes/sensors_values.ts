import { Router, Response, Request } from 'express';
import config from '../config';
import * as values from '../db/sensors_values';

const { logger } = config;

const router = Router();

function local_logger(res: Response, action: string, exc: Error): void {
    logger(`Error while ${action} sensors values. filename: ${__dirname}.\r\nError${exc}`);
    res.sendStatus(500);
}

function send(this: Response, data: any): void {
    data ? this.status(200).send(data) : this.sendStatus(200);
}

router.get('/', (req: Request, res: Response): void => {
    values.Get()
        .then(send.bind(res))
        .catch(local_logger.bind(null, res, 'getting'));
});

router.post('/', (req: Request, res: Response): void => {
    values.Create(req.body)
        .then(send.bind(res))
        .catch(local_logger.bind(null, res, 'adding'));
});

router.delete('/', (req: Request, res: Response): void => {
    values.Delete()
        .then(send.bind(res, null))
        .catch(local_logger.bind(null, res, 'deleting'));
});

export default router;