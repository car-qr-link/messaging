import { NotificationChannel, SendMessage, SendMessageSchema } from "@car-qr-link/apis";
import { config } from "./config";
import { SmsGatewayClient } from "./gateway";
import { createClient } from "./queue";
import { createLogger } from "./logger";

async function main() {
    const logger = createLogger();
    const queue = createClient(config.BROKER_URL);
    const gateway = new SmsGatewayClient(config.GATEWAY_URL);

    await queue.start();

    const unsubscribe = await queue.subscribe<SendMessage>(config.SEND_QUEUE, async (queueName, message) => {
        const { error } = SendMessageSchema.validate(message);
        if (error) {
            logger.error("Invalid message:", error);
            return;
        }

        if (message.channel !== NotificationChannel.Phone) {
            logger.error("Unsupported channel", message);
            return;
        }

        logger.info('Message received', message);

        await gateway.send({
            to: message.to,
            text: message.message,
        });

        logger.info('Message sent', message);
    });
    logger.info(`Listening on ${config.SEND_QUEUE}...`);

    process.on('SIGINT', async () => {
        logger.info('Shutting down...');
        unsubscribe();
        await queue.close();

        logger.info('Bye!');
        process.exit(0);
    });

    logger.info('Ready!');
}

main();