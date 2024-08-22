import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { Logger } from "../logger";
import { QueueClient } from "../queue";
import { promisify } from "util";

interface RequestBody {
    event: string;
}

interface WebhookPayload {
    message: string;
    phoneNumber: string;
    receivedAt: string;
}

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
        this.httpServer = createServer(async (req, res) => {
            try {
                await this.handler(req, res);
            } catch (error: any) {
                this.logger.error('Error handling request', error);

                res.writeHead(500);
                res.write('Internal server error');
                res.end();
            }
        });

        this.httpServer.listen(this.port, () => {
            this.logger.info('Listening on port ' + this.port);
        });

        this.logger.info('ReceiverService started');
    }

    private async handler(req: IncomingMessage, res: ServerResponse) {
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
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                resolve(data);
            });
            req.on('error', (err) => {
                reject(err);
            });
        });

        this.logger.info('Request body', { body: JSON.parse(body) });

        // await this.queue.publish(
        //     this.queueName,
        //     req
        // );

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