import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import morgan from 'morgan';



//files and folders imports
import { morganMiddleware } from './middlewares/morgan.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import HomeRouter from "./routes/api/v1/home.routes"


const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
if (process.env.NODE_ENV === 'development') {
    app.use(morganMiddleware);
}


//routes
app.use('/api/v1', HomeRouter)


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});


export default app 