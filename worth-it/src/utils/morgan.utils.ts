import morgan from "morgan";
import { NODE_ENV } from "../config/env.config";
import path from "path";
// Configure Morgan logging format
const morganFormat = NODE_ENV === 'production'
  ? 'combined'    // Apache-style logging for production
  : 'dev';   


export const morganFormats = morgan(morganFormat, {
    skip: (req, res) => {
        // Skip logging for successful health check endpoints
        return req.url === '/health' && res.statusCode === 200;
      },
      stream: {
        write: (message: string) => {
          // Write to CloudWatch logs in production, console in development
          console.log(message.trim());
        }
      }
});