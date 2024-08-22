import { config } from "./config";
import { SmsGatewayClient } from "./gateway";
import { createLogger } from "./logger";
import { createClient } from "./queue";
import { SenderService } from "./services/sender";

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

    await queue.start();
    await sendService.start();

    process.on('SIGINT', async () => {
        logger.info('Shutting down...');
        await sendService.stop();
        await queue.close();

        logger.info('Bye!');
        process.exit(0);
    });

    logger.info('Ready!');
}

main();
