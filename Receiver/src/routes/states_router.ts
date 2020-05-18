import { Router, Request, Response } from 'express'
import { get, states_list, update, deleteState, create } from '../db/states'

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

router.get('/list', (req: Request, res: Response) => {
    const colors = new Proxy(['red', 'yellow', 'green'], {
        get(target, prop: number) {
            return target[+prop - 1]
        }
    });
    states_list()
        .then(data => {
            return data.reduce(
                (result: object, item: { Id: number, Name: string }) => ({
                    ...result,
                    [item.Id]: {
                        Name: item.Name,
                        color: colors[item.Id]
                    }
                }), {})
        })
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res))
})

export default router;
