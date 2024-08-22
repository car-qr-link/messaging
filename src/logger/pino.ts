import pino from "pino";
import { Logger } from "./logger";

export class PinoAdapter implements Logger {
    protected readonly logger: pino.Logger;

    public constructor() {
        this.logger = pino();
    }

    debug(message: string, context: object): void {
        this.logger.debug(context, message);
    }
    info(message: string, context: object): void {
        this.logger.info(context, message);
    }
    warn(message: string, context: object): void {
        this.logger.warn(context, message);
    }
    error(message: string, context: object): void {
        this.logger.error(context, message);
    }

}