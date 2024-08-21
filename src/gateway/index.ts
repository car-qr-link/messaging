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
    // protected readonly client;

    public constructor(protected readonly gatewayUrl: string) {
    }

    public async send(message: OutgoingMessage): Promise<void> {
        const payload = {
            message: message.text,
            phoneNumbers: [message.to],
        };

        const response = await fetch(new URL('message', this.gatewayUrl).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        console.log('Sent message:', await response.json());
    }
}