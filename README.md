# Сервис сообщений - SMS

Отвечает за отправку сообщений и уведомлений по SMS с использованием [SMS Gateway for Android™](https://sms.capcom.me), а также прием входящих сообщений.

Имя пакета: `@car-qr-link/messaging-sms`

## Используемые технологии, библиотеки

- [SMS Gateway for Android™](https://sms.capcom.me)
- [Redis](https://redis.io)
- [Joi](https://joi.dev)
- [Pino](https://github.com/pinojs/pino)
- [dotenv](https://github.com/motdotla/dotenv)

## Настройки

Для настройки используются переменные окружения:

| Название        | Описание                             | По умолчанию                             |
| --------------- | ------------------------------------ | ---------------------------------------- |
| `BROKER_URL`    | URL брокера сообщений                | `redis://localhost:6379/0`               |
| `SEND_QUEUE`    | Имя очереди для отправки сообщений   | `messages:send:phone`                    |
| `RECEIVE_QUEUE` | Имя очереди для полученных сообщений | `messages:received`                      |
| `GATEWAY_URL`   | URL SMS-шлюза                        | `https://sms.capcom.me/api/3rdparty/v1/` |
| `WEBHOOK_PORT`  | Порт локального сервера для вебхуков | `3000`                                   |

## Входящие взаимодействия

Сервис принимает сообщения `SendMessage` из очереди `SEND_QUEUE` и на их основе выполняет отправку SMS-сообщений через шлюз `GATEWAY_URL`.

Также принимает HTTP-запросы на порт `WEBHOOK_PORT` от SMS-шлюза для дальнейшией их передачи в очередь `RECEIVED_QUEUE`.

## Исходящие взаимодействия

На основании поступающих HTTP-запросов формирует сообщения `MessageReceived` и помещает их в очередь `RECEIVED_QUEUE`.

