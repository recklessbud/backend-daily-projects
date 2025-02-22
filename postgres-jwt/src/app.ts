// dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();

//files
import { errorHandler } from './middlewares/errorHandler.middleware';
import homeRoutes from './routes/home.routes';
import path from 'path';



//express middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');	
app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static('public'));
app.use(morgan('dev'));



// routes
app.use('/', homeRoutes);

//use errorHandler middleware
app.use(errorHandler);

export default app;