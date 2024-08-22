import { NotificationChannel, SendMessage, SendMessageSchema } from "@car-qr-link/apis";
import { SmsGatewayClient } from "../gateway";
import { Logger } from "../logger";
import { QueueClient } from "../queue";

export class SenderService {
    private unsubscribe: (() => void) | null;

    public constructor(
        private readonly queueName: string,

        private readonly queue: QueueClient,
        private readonly gateway: SmsGatewayClient,
        private readonly logger: Logger
    ) {
        this.unsubscribe = null;
    }

    public async start() {
        this.unsubscribe = await this.queue.subscribe<SendMessage>(this.queueName, async (queueName, message) => {
            const { error } = SendMessageSchema.validate(message);
            if (error) {
                this.logger.error("Invalid message:", error);
                return;
            }

            if (message.channel !== NotificationChannel.Phone) {
                this.logger.error("Unsupported channel", message);
                return;
            }

            this.logger.info('Message received', message);

            await this.gateway.send({
                to: message.to,
                text: message.message,
            });

            this.logger.info('Message sent', message);
        });

        this.logger.info('SendService started');
    }

    public async stop() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        this.unsubscribe = null;

        this.logger.info('SendService stopped');
    }
}