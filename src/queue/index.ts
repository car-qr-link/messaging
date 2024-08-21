import { URL } from 'url';
import { QueueClient } from './queue';
import { RedisClient } from './redis';

export * from './queue';
export * from './redis';

export function createClient(brokerUrl: string): QueueClient {
    const url = new URL(brokerUrl);

    if (url.protocol === 'redis:') {
        return new RedisClient(brokerUrl);
    } else {
        throw new Error(`Invalid broker url: ${brokerUrl}`);
    }
}