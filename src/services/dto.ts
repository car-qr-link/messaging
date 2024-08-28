// {
//   "deviceId": "ffffffffceb0b1db0000018e937c815b",
//   "event": "sms:received",
//   "id": "Ey6ECgOkVVFjz3CL48B8C",
//   "payload": {
//     "message": "Android is always a sweet treat!",
//     "phoneNumber": "6505551212",
//     "receivedAt": "2024-06-22T15:46:11.000+07:00"
//   },
//   "webhookId": "<unique-id>"
// }

import Joi from "joi";

export interface WebhookRequest {
    webhookId: string;
    payload: WebhookPayload;
    event: 'sms:received';
}

export interface WebhookPayload {
    message: string;
    phoneNumber: string;
    receivedAt: string;
}

export const WebhookRequestSchema = Joi.object<WebhookRequest>({
    webhookId: Joi.string().required(),
    payload: Joi.object<WebhookPayload>({
        message: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        receivedAt: Joi.date().iso().required(),
    }).required(),
    event: Joi.string().valid('sms:received').required(),
});
