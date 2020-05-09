export type subscribe_fn = (key: string) => void

export class Observer {
    subscribers: Array<subscribe_fn> = [];
    constructor() { }

    subscribe(callback: subscribe_fn): void {
        this.subscribers.push(callback);
    }

    unsubscribe(fn: subscribe_fn): void {
        this.subscribers = this.subscribers.filter(f => f !== fn);
    }

    broadcast(data: string) {
        this.subscribers.forEach(
            callback => callback(data)
        )
    }
}
