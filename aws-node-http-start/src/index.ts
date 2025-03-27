import app from "./app";
import 'express-async-errors'

import serverless from "serverless-http"


export const handler = serverless(app);  