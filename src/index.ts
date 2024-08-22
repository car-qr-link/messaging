import { createServer } from "http";
import { config } from "./config";
import { SmsGatewayClient } from "./gateway";
import { createLogger } from "./logger";
import { createClient } from "./queue";
import { SenderService } from "./services/sender";
import { promisify } from "util";
import { ReceiverService } from "./services/receiver";

async function main() {
    const logger = createLogger();
    const queue = createClient(config.BROKER_URL);
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
