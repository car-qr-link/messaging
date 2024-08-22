import { ConsoleAdapter } from "./console";
import { Logger } from "./logger";
import { PinoAdapter } from "./pino";

export const createLogger: (() => Logger) = () => process.env.NODE_ENV !== 'production' ? new ConsoleAdapter() : new PinoAdapter()

export * from "./logger";