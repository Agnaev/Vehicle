import { Router, Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import config from '../config';

const {
    logger,
    basedir,
    web_socket,
    error_handler_404
} = config;

const router = Router();

router.get('/', (req: Request, res: Response): void => {
    try {
        const fileName: string = path.join(basedir, 'View', 'Index.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger(`Error processing request '/'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
})

router.get('/values', (req: Request, res: Response): void => {
    try {
        const filename = path.join(basedir, 'View', 'SensorsValues.html');
        res.sendFile(filename);
    }
    catch (exc) {
        logger(`Error while getting sensors values from database. filename: ${__dirname}.\r\nError${exc}`);
        res.sendStatus(500);
    }
})

router.get('/sensors', (req: Request, res: Response) => {
    try {
        const fileName: string = path.join(basedir, 'View', 'Sensors.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger(`Error processing request '/sensors'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
});

router.get('/states', (req: Request, res: Response) => {
    try {
        const filename: string = path.join(basedir, 'View', 'States.html');
        res.sendFile(filename);
    }   
    catch(exc) {
        logger(`Error processing request '/states'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
})

router.get('/api/get_socket_connection', (req: Request, res: Response): void => {
    res.send(web_socket)
});

router.get('/api/get_images_list', (req: Request, res: Response): void => {
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
