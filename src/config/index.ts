require('dotenv').config();

export interface Config {
    BROKER_URL: string
    QUEUE_NAME: string
}

export const config: Config = {
    BROKER_URL: process.env.BROKER_URL || 'redis://localhost:6379/0',
    QUEUE_NAME: process.env.QUEUE_NAME || 'messaging:sms'
}
