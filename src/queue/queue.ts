export interface QueueClient {
    start(): Promise<void>;
    subscribe<T>(queueName: string, callback: (queueName: string, message: T) => Promise<void>, options?: SubscribeOptions): Promise<() => void>;
    publish<T>(queueName: string, message: T): Promise<void>;
    close(): Promise<void>;
}

export class SubscribeOptions {
    public readonly intervalMs: number;
    public readonly waitTimeMs: number;

    public constructor(intervalMs: number, waitTimeMs: number) {
        if (waitTimeMs > intervalMs) {
            throw new Error('waitTime must be less than interval');
        }

        if (waitTimeMs <= 0) {
            throw new Error('waitTime must be greater than or equal to 0');
        }

        if (intervalMs <= 0) {
            throw new Error('interval must be greater than or equal to 0');
        }

        this.intervalMs = intervalMs;
        this.waitTimeMs = waitTimeMs;
    }
}