import { Router, Request, Response } from 'express';
import { get, states_list, update, deleteState, create, getById } from '../db/states';

const router: Router = Router();

const sender = function (this: Response, status: number, data: any) {
    this.status(status).send(status === 500 && data.Message || data)
}

const error_sender = function (this: Response, { message }: Error) {
    return sender.call(this, 500, message)
}

const success_sender = function (this: Response, data: any) {
    return sender.call(this, 200, data)
}

router.get('/', (req: Request, res: Response) => {
    get()
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res))
});

router.get('/get_range', (req: Request, res: Response) => {
    getById(+req?.query?.Id || 0)
        .then(result => res. status(200).send(result))
        .catch(exc => res.status(500).send(exc));
})

router.post('/', (req: Request, res: Response) => {
    create(req.body)
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res))
});

router.put('/', (req: Request, res: Response) => {
    update(req.body)
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res));
});

router.delete('/', (req: Request, res: Response) => {
    deleteState(req.body)
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res))
});

router.get('/list', async (req: Request, res: Response) => {
    try {
        const colors = new Proxy(['red', 'yellow', 'green'], {
            get(target, prop: number) {
                return target[+prop - 1]
            }
        });
        const _states_list = await states_list();
        const result = {};
        for (const item of _states_list) {
            Object.assign(result, {
                [item.Id]: {
                    Name: item.Name,
                    color: colors[item.Id]
                }
            })
        }
        success_sender.call(res, result);
    }
    catch (exc)  {
        error_sender.call(res, exc);
    }
})

export default router;
