import morgan from "morgan";
import envVariables from "./env.config";
import path from "path";

const { STAGE } = envVariables

// Configure Morgan logging format
const morganFormat = STAGE === 'prod'
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