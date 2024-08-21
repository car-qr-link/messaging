import { NotificationChannel, SendMessage, SendMessageSchema } from "@car-qr-link/apis";
import { config } from "./config";
import { SmsGatewayClient } from "./gateway";
import { createClient } from "./queue";

async function main() {
    const queue = createClient(config.BROKER_URL);
    const gateway = new SmsGatewayClient(config.GATEWAY_URL);

    await queue.start();

    const unsubscribe = await queue.subscribe<SendMessage>(config.SEND_QUEUE, async (queueName, message) => {
        const { error } = SendMessageSchema.validate(message);
        if (error) {
            console.error("Invalid message:", error);
            return;
        }

        if (message.channel !== NotificationChannel.Phone) {
            console.error("Unsupported channel:", message.channel);
            return;
        }

        console.log('Received message:', message);

        await gateway.send({
            to: message.to,
            text: message.message,
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