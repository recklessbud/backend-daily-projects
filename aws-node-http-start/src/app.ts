import express from "express";
import helmet from "helmet";

const app = express();

//files 
import { morganFormats } from "./config/morgan.config";
import { errorHandler } from "./helper/errorHandler.helper";
 
//middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//error handler
app.use(errorHandler);

//morgan
app.use(morganFormats);


//routes
app.get('/', (req, res) => {
    res.status(200).json({ status: 'yeah' });
});



export default app;