// import Client from "android-sms-gateway";
import { URL } from "url";

const httpAdapter = {
    get: async function <T>(url: string, headers?: Record<string, string>): Promise<T> {
        return fetch(url, { headers }).then(response => response.json());
    },
    post: async function <T>(url: string, body: any, headers?: Record<string, string>): Promise<T> {
        return fetch(url, { headers, method: 'POST', body: JSON.stringify(body) }).then(response => response.json());
    },
    delete: async function <T>(url: string, headers?: Record<string, string>): Promise<T> {
        return fetch(url, { headers, method: 'DELETE' }).then(response => response.json());
    }
};

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
        const url = new URL(gatewayUrl);

        // this.client = new Client(
        //     url.username,
        //     url.password,
        //     httpAdapter,
        //     `${url.origin}${url.pathname}`
        // );
    }

    public async send(message: OutgoingMessage): Promise<void> {
        // await this.client.send({
        //     message: message.text,
        //     phoneNumbers: [
        //         message.to
        //     ]
        // });
    }
}