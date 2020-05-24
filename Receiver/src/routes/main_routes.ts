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

const createType = async (count: number) => {
    await makeRequest(`
        INSERT INTO MetricsTypes(Name, Description, MinValue, MaxValue)
        OUTPUT INSERTED.Id
        VALUES ('${count}', '${count}', 0, 100);
    `)
        .then(x => x.recordsets[0][0]['Id'])
        .then(Id =>
            makeRequest(`
            INSERT INTO MetricsStates (MetricTypeId, StateId, MinValue, MaxValue)
            VALUES (${Id}, 1, 0, 25),
            (${Id}, 2, 26, 50),
            (${Id}, 3, 51, 100);
        `)
        )
}

fs.mkdirSync(path.join(basedir, 'statistic', 'experiment'), {
    recursive: true
});
router.post('/api/statistic', (req: Request, res: Response) => {
    makeRequest(`SELECT COUNT(*) as count FROM MetricsTypes`)
        .then(x => x.recordsets[0][0]['count'])
        .then(count => {
            const path_to_files: string = path.join(basedir, 'statistic', 'experiment');
            if(!fs.existsSync(path_to_files)) {
                fs.mkdirSync(path_to_files, {
                    recursive: true
                });
            }
            fs.writeFileSync(
                path.join(basedir, 'statistic', 'experiment', count + '_types.txt'),
                Object.keys(req.body)[0].toString()
            );
            return count;
        })
        .then(count => {
            for (let i = count + 1; i <= count + 10; i++) {
                createType(i);
            }
            res.sendStatus(200);
        })
        .catch(exc => res.status(500).send(exc));
});

const init_db = (res: Response) => {
    makeRequest(`SELECT COUNT(*) as count FROM MetricsTypes`)
        .then(x => x.recordsets[0][0]['count'])
        .then(count => count == 0)
        .then(isNeed => {
            if (isNeed) {
                const types = [];
                for (let i = 1; i <= 10; i++) {
                    types.push(createType(i));
                }
                Promise.all(types)
                .then(() => res.status(200).send(true))
                .catch(exc => res.status(500).send(exc));
            }
            else res.status(500).send(false);
        });
}

router.get('/first_type_init', (req: Request, res: Response) => init_db(res));
router.get('/clear_db', (req: Request, res: Response) => {
    makeRequest(`
        DELETE FROM MetricsStates;
        DELETE FROM MetricsTypes;
    `)
        .then(() => init_db(res))
})

export default router;
