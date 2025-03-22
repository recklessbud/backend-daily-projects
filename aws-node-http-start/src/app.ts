import express from "express";
import helmet from "helmet";
import path from "path";
import fs from 'fs'

const app = express();

//files 
import { morganFormats } from "./config/morgan.config";
import { errorHandler } from "./helper/errorHandler.helper";
import HomeRoutes from './routes/v1/home.routes'
// import { getStaticFile } from "./config/static.config";
import OtherPages from "./routes/v1/other.routes"
 
//middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), './src/views'));



//error handler
app.use(errorHandler);  

//morgan
app.use(morganFormats);
 
 
//routes
app.use('/v1', HomeRoutes)
app.use('/v1/other', OtherPages)




export default app; 