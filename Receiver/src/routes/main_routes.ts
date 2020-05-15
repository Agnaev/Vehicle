import { Router, Response, Request } from 'express';
import config from '../config';
import fs from 'fs';
import path from 'path';

const {
    logger,
    basedir,
    web_socket,
    error_handler_404
} = config;

const router = Router();

router.get('/', (req: Request, res: Response) => {
    try {
        const fileName: string = path.join(basedir, 'View', 'Index.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger(`Error processing request '/'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
})

router.get('/values', (req: Request, res: Response) => {
    try {
        res.sendFile(path.join(basedir, 'View', 'MetricsValues.html'));
    }
    catch (exc) {
        logger(`Error while getting metrics values from database. filename: ${__dirname}.\r\nError${exc}`);
        res.sendStatus(500);
    }
})

router.get('/metrics', (req: Request, res: Response) => {
    try {
        const fileName: string = path.join(basedir, 'View', 'Metrics.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger(`Error processing request '/metrics'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
});

router.get('/api/get_socket_connection', (req: Request, res: Response) => {
    res.send(web_socket)
});

router.get('/api/get_images_list', (req: Request, res: Response) => {
    try {
        const files: string[] = fs.readdirSync(
            path.join(basedir, 'View', 'images')
        ).filter(file =>
            ['png', 'jpg', 'jpeg', 'svg']
                .includes(
                    path.extname(file).slice(1)
                )
        );
        res.send(files);
    }
    catch (exc) {
        logger(`Error processing request '/api/get_images_list'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
});

export default router;
