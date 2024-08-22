require('dotenv').config();

export interface Config {
    BROKER_URL: string
    SEND_QUEUE: string
    RECEIVED_QUEUE: string

    GATEWAY_URL: string
}

export const config: Config = {
    BROKER_URL: process.env.BROKER_URL || 'redis://localhost:6379/0',
    SEND_QUEUE: process.env.SEND_QUEUE || 'messages:send:sms',
    RECEIVED_QUEUE: process.env.RECEIVED_QUEUE || 'messages:received',

    GATEWAY_URL: process.env.GATEWAY_URL || 'https://sms.capcom.me/api/3rdparty/v1/',
}
