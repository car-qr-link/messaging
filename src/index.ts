import { createLogger, createQueueClient } from "@car-qr-link/messaging-base";
import { config } from "./config";
import { SmsGatewayClient } from "./gateway";
import { ReceiverService } from "./services/receiver";
import { SenderService } from "./services/sender";

async function main() {
    const logger = createLogger();
    const queue = createQueueClient(config.BROKER_URL);
    const gateway = new SmsGatewayClient(config.GATEWAY_URL);

    const sendService = new SenderService(
        config.SEND_QUEUE,
        queue,
        gateway,
        logger
    );
    const receiveService = new ReceiverService(
        config.WEBHOOK_PORT,
        config.RECEIVED_QUEUE,
        queue,
        logger
    );

    await queue.start();
    await sendService.start();
    await receiveService.start();

    process.on('SIGINT', async () => {
        logger.info('Shutting down...');
        await receiveService.stop();
        await sendService.stop();
        await queue.close();

        logger.info('Bye!');
        process.exit(0);
    });

    logger.info('Ready!');
}

main();
