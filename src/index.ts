import { MessageReceived, NotificationChannel, SendMessage } from "@car-qr-link/apis";
import { config } from "./config";
import { createClient, RedisClient } from "./queue";

async function main() {
    const client = createClient(config.BROKER_URL);
    await client.start();

    const unsubscribe = await client.subscribe<SendMessage>(config.SEND_QUEUE, async (queueName, message) => {
        console.log('Received message:', message);

        client.publish<MessageReceived>(config.RECEIVED_QUEUE, {
            channel: NotificationChannel.Sms,
            message: message.message,
            from: message.to,
        });
    });
    console.info(`Listening on ${config.SEND_QUEUE}...`);

    process.on('SIGINT', async () => {
        console.info('Shutting down...');
        unsubscribe();
        console.info('Bye!');

        await client.close();
        process.exit(0);
    });

    console.info('Ready!');
}

main();