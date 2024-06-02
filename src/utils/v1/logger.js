import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        })
    ],
    format: winston.format.combine(
        winston.format.json(),
    ),
    silent: false
});

export default logger;