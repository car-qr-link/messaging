import { createClient, RedisClientType } from "redis";

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

export class RedisClient<T> {
    protected readonly client: RedisClientType;

    public constructor(brokerUrl: string) {
        this.client = createClient({ url: brokerUrl });
        this.client.on('error', (err) => {
            throw err;
        })
    }

    public async start() {
        await this.client.connect();
    }

    protected async subscribe(queueName: string, callback: (queueName: string, message: T) => void, options?: SubscribeOptions): Promise<() => void> {
        const interval = setInterval(async () => {
            try {
                const message = await this.client.brPop(queueName, options?.waitTimeMs || 500);
                if (!message) {
                    return;
                }

                const payload = JSON.parse(message.element);
                if (!payload) {
                    console.error(`Invalid payload: ${message.element}`);
                    return;
                }

                callback(message.key, payload);
            } catch (e) {
                console.error(e);
            }
        }, options?.intervalMs || 1000);

        return () => {
            clearInterval(interval);
        };
    }
}