import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { DatabaseCheck } from './db/db_connection';
import config from './config';
import routers from './routes/router';
import fs from 'fs';

const {
    logger,
    basedir,
    error_handler_404,
    server: {
        port,
        host
    }
} = config;

const app = express();

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(basedir, 'View')));
app.use((req: Request, res: Response, next: Function): void => {
    logger(`middleware ${req.method} ip: ${req.ip} request: ${req.path}`);
    next();
});
app.use('/api/sensors_values', routers.values);
app.use('/api/sensors', routers.types);
app.use('/api/states', routers.states);
app.use('/', routers.main);
app.use((req: Request, res: Response): void => {
    logger(`Client with ip: ${req.ip} got 404 error with request: ${req.originalUrl}`);
    error_handler_404(res, 'Страница не найдена.')
});

app.listen(port, host, async (): Promise<void> => {
    try {
        const db_check = DatabaseCheck();

        fs.copyFileSync(
            path.join(basedir, 'node_modules', 'jquery', 'dist', 'jquery.min.js'),
            path.join(basedir, 'View', 'scripts', 'minifyjs', 'jquery.min.js')
        );

        await db_check;
        logger(`server has been started at ${host}:${port}.`);
    }
    catch (exc) {
        logger('Error starting application.', exc);
        process.exit(1);
    }
});


