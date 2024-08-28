export interface QueueClient {
    start(): Promise<void>;
    subscribe<T>(queueName: string, callback: (queueName: string, message: T) => Promise<void>, options?: SubscribeOptions): Promise<() => void>;
    publish<T>(queueName: string, message: T): Promise<void>;
    close(): Promise<void>;
}

export class SubscribeOptions {
    public readonly interval: number;
    public readonly waitTime: number;

    public constructor(interval: number, waitTime: number) {
        if (waitTime > interval) {
            throw new Error('waitTime must be less than interval');
        }

        if (waitTime <= 0) {
            throw new Error('waitTime must be greater than or equal to 0');
        }

        if (interval <= 0) {
            throw new Error('interval must be greater than or equal to 0');
        }

        this.interval = interval;
        this.waitTime = waitTime;
    }
}