import morgan from "morgan";
import { logger } from "../utils/logs.utils";


export const morganStream = {
    write: (text: string) => {
        logger.info(text.trim());
    },
};

export const morganMiddleware = morgan("combined", { stream: morganStream });