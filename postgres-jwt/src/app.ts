// dependencies
import express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

//express middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');	
app.use(express.static('public'));


export default app;