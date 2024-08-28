import { RedisClientType, createClient } from "redis";
import { QueueClient, SubscribeOptions } from "./queue";

export class RedisClient implements QueueClient {
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

    public async subscribe<T>(
        queueName: string,
        callback: (queueName: string, message: T) => Promise<void>,
        options?: SubscribeOptions
    ): Promise<() => void> {
        const readNext = async () => {
            let interval = options?.interval || 1;
            try {
                const message = await this.client.brPop(queueName, options?.waitTime || 0.5);
                if (!message) {
                    return;
                }

                const payload = JSON.parse(message.element);
                if (!payload) {
                    console.error(`Invalid payload:`, message.element);
                    return;
                }

                await callback(message.key, payload);
                interval = 0;
            } catch (e) {
                console.error(e);
            } finally {
                timer = setTimeout(readNext, interval);
            }
        };

        let timer = setTimeout(async () => {
            await readNext();
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }

    public async publish<T>(queueName: string, message: T) {
        await this.client.lPush(queueName, JSON.stringify(message));
    }

    public async close() {
        await this.client.quit();
    }
}