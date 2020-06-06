import { Router, Response, Request } from 'express';
import * as types from '../db/types';
import config from '../config';
const { logger } = config;

function local_logger(res: Response, action: string, exc: Error):void {
    logger(`Error processing request ${action} metric\r\nfilename:`, __dirname, exc);
    res.sendStatus(500);
}

const router = Router();
router.delete('/', (req: Request, res: Response): void => {
    types.Delete(req.body)
        .then(() => res.sendStatus(200))
        .catch(local_logger.bind(null, res, 'delete'))
});

router.put('/', (req: Request, res: Response): void => {
    types.Update(req.body)
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'update'))
});

router.post('/', (req: Request, res: Response): void => {
    types.Create(req.body)
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'create'))
});

router.get('/', (req: Request, res: Response): void => {
    types.GetMetrics()
        .then(data => res.status(200).send(data))
        .catch(local_logger.bind(null, res, 'get'))
});

export default router;

