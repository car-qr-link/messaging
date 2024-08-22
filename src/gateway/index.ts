import { URL } from "url";

export interface OutgoingMessage {
    to: string
    text: string
    isNotification?: boolean;
}

export interface IncomingMessage {
    from: string
    text: string
}

export class SmsGatewayClient {
    protected readonly baseUrl: string;
    protected readonly authorization: string;

    public constructor(gatewayUrl: string) {
        const url = new URL(gatewayUrl);
        this.baseUrl = `${url.origin}${url.pathname}`;
        this.authorization = Buffer.from(`${url.username}:${url.password}`).toString('base64');
    }

    public async send(message: OutgoingMessage): Promise<void> {
        const payload = {
            message: message.text,
            phoneNumbers: [message.to],
        };

        const response = await fetch(new URL('message', this.baseUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${this.authorization}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        console.log('Sent message:', await response.json());
    }
}