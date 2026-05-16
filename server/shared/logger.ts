import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development"

export const logger = pino(
    {
        level: "info",

        transport: isDevelopment
            ? {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            }
            : undefined,
    }
);