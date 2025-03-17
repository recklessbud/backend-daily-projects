import { NextFunction, Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

const app = express();


//files
 import corsOptions from "./config/cors.config";
 import { errorHandler } from "./middleware/Handler.middleware";
 import homeRouter from "./routes/home.routes"
 import { successResponse } from "./utils/responses.util";
 import { morganFormats } from "./utils/morgan.utils";
 import productRouter from "./routes/products.routes";


// Body parser configuration
app.use(express.json({
  verify: (req: any, res: Response, buf: Buffer, encoding: string) => {
    if (buf.length !== parseInt(req.headers['content-length'] || '0')) {
        throw new Error('Request size does not match Content-Length');
    }
}
}))
app.use(cors(corsOptions));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));


// app.set('trust proxy', true)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), './src/views'));
//error handle
app.use(errorHandler); 

// Morgan middleware
app.use(morganFormats)

// Routes 
app.use('/', homeRouter)
app.use('/api/products', productRouter)	



console.log("boom ")

export default app