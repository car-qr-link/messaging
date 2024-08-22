import { Logger } from "./logger";

export class ConsoleAdapter implements Logger {
    debug(message: string, context?: object): void {
        console.debug(message, context || '');
    }
    info(message: string, context?: object): void {
        console.info(message, context || '');
    }
    warn(message: string, context?: object): void {
        console.warn(message, context || '');
    }
    error(message: string, context?: object): void {
        console.error(message, context || '');
    }
}