import winston from "winston";
import path from "path";
import "winston-daily-rotate-file"
// import prisma from "../../";

const logsDir = path.join(process.cwd(), "logs");

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, "error-%DATE%.log"),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
            maxSize: '20m'
        }),      
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'http-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'http',
            maxFiles: '14d',
            maxSize: '20m'
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, "combined-%DATE%.log"),
            datePattern: 'YYYY-MM-DD',
            // level: 'info',
            maxFiles: '14d',
            maxSize: '20m'
        })
    ],
})



if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}