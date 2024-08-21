require('dotenv').config();

export interface Config {
    BROKER_URL: string
    SEND_QUEUE: string
    RECEIVED_QUEUE: string
}

export const config: Config = {
    BROKER_URL: process.env.BROKER_URL || 'redis://localhost:6379/0',
    SEND_QUEUE: process.env.SEND_QUEUE || 'messages:send:sms',
    RECEIVED_QUEUE: process.env.RECEIVED_QUEUE || 'messages:received',
}
