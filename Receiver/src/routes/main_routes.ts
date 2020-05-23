import { Router, Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import config from '../config';
import { makeRequest } from '../db/db_connection';

const {
    logger,
    basedir,
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
        const filename = path.join(basedir, 'View', 'MetricsValues.html');
        res.sendFile(filename);
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

router.get('/states', (req: Request, res: Response) => {
    try {
        const filename: string = path.join(basedir, 'View', 'States.html');
        res.sendFile(filename);
    }
    catch (exc) {
        logger(`Error processing request '/states'.\r\nfilename: ${__dirname}`, exc);
        error_handler_404(res, exc);
    }
})

router.get('/api/get_socket_connection', (req: Request, res: Response): void => {
    res.send(config.web_socket)
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

router.get('/collect_stat', (req: Request, res: Response): void => {
    res.status(200).send({ collect: config.collect_statistics })
});

router.post('/api/statistic', (req: Request, res: Response) => {
    makeRequest(`SELECT COUNT(*) as count FROM MetricsTypes`)
        .then(x => x.recordsets[0][0]['count'])
        .then(count => {
            fs.writeFile(path.join(basedir, 'statistic', count + '_types_1.txt'), Object.keys(req.body)[0].toString(), () => {})
            // const writer = fs.createWriteStream(path.join(basedir, 'statistic', count + '_types.txt'))
            // writer.write(Object.keys(req.body)[0].toString() + ',');
            // writer.end();
            return count;
        })
        .then(count => 
            makeRequest(`
                INSERT INTO MetricsTypes(Name, Description, MinValue, MaxValue)
                OUTPUT inserted.Id
                VALUES ('${count + 1}', '${count + 1}', 0, 100)
            `)
        )
        .then(x => x.recordsets[0][0].Id)
        .then(x => {
            makeRequest(`
                insert into MetricsStates (MetricTypeId, StateId, MinValue, MaxValue)
                values (${x}, 1, 0, 25),
                (${x}, 2, 26, 50),
                (${x}, 3, 51, 100)
            `)
        });

    

    res.sendStatus(200);
});

export default router;
