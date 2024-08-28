import { MessageReceived, NotificationChannel } from "@car-qr-link/apis";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { promisify } from "util";
import { Logger } from "../logger";
import { QueueClient } from "../queue";
import { WebhookRequest, WebhookRequestSchema } from "./dto";

export class ReceiverService {
    private httpServer: Server | null;

    constructor(
        private readonly port: number,
        private readonly queueName: string,

        private readonly queue: QueueClient,
        private readonly logger: Logger
    ) {
        this.httpServer = null;
    }

    public async start() {
        this.httpServer = createServer((req, res) => {
            this.handler(req, res)
                .catch((error: any) => {
                    this.logger.error('Error handling request', error);

                    res.writeHead(500);
                    res.write('Internal server error');
                    res.end();
                });
        });

        this.httpServer.listen(this.port, () => {
            this.logger.info('Listening on port ' + this.port);
        });

        this.logger.info('ReceiverService started');
    }

    private async handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
        this.logger.info('Request received', req);

        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
            res.writeHead(400);
            res.write('Bad request');
            res.end();
            return;
        }

        const body = await new Promise<string>((resolve, reject) => {
            let data = '';
            req.on('data', (chunk: any) => {
                data += chunk;
            });
            req.on('end', () => {
                resolve(data);
            });
            req.on('error', (err: any) => {
                reject(err);
            });
        });

        const json = JSON.parse(body) as WebhookRequest;
        const { error } = WebhookRequestSchema.validate(json, { allowUnknown: true });

        if (error) {
            this.logger.error('Invalid request', { error });

            res.writeHead(400);
            res.write('Bad request');
            res.end();
            return;
        }

        await this.queue.publish<MessageReceived>(
            this.queueName,
            {
                channel: NotificationChannel.Phone,
                message: json.payload.message,
                from: json.payload.phoneNumber,
            }
        );

        res.writeHead(200);
        res.write('OK');
        res.end();
    }

    public async stop() {
        if (this.httpServer) {
            await promisify(this.httpServer.close.bind(this.httpServer))();
        }

        this.httpServer = null;

        this.logger.info('ReceiverService stopped');
    }
}