import { Logger } from "./logger";

export class ConsoleAdapter implements Logger {
    debug(message: string, context?: object): void {
        console.debug(
            new Date(),
            '[DEBUG]',
            message,
            context || ''
        );
    }
    info(message: string, context?: object): void {
        console.info(
            new Date(),
            '[INFO]',
            message,
            context || ''
        );
    }
    warn(message: string, context?: object): void {
        console.warn(
            new Date(),
            '[WARN]',
            message,
            context || ''
        );
    }
    error(message: string, context?: object): void {
        console.error(
            new Date(),
            '[ERROR]',
            message,
            context || ''
        );
    }
}