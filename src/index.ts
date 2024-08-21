import { MessageReceived, NotificationChannel, SendMessage, SendMessageSchema } from "@car-qr-link/apis";
import { config } from "./config";
import { SmsGatewayClient } from "./gateway";
import { createClient } from "./queue";

async function main() {
    const queue = createClient(config.BROKER_URL);
    const gateway = new SmsGatewayClient(config.GATEWAY_URL);

    await queue.start();

    const unsubscribe = await queue.subscribe<SendMessage>(config.SEND_QUEUE, async (queueName, message) => {
        console.log('Received message:', message);
        console.log(SendMessageSchema.validate(message));

        await queue.publish<MessageReceived>(config.RECEIVED_QUEUE, {
            channel: NotificationChannel.Phone,
            message: message.message,
            from: message.to,
        });
    });
    console.info(`Listening on ${config.SEND_QUEUE}...`);

    process.on('SIGINT', async () => {
        console.info('Shutting down...');
        unsubscribe();
        console.info('Bye!');

        await queue.close();
        process.exit(0);
    });

    console.info('Ready!');
}

main();