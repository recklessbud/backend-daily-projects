import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';


dotenv.config();
//files
import homeRoutes from "./routes/home.routes"
import connectDB from './config/dbconn';
import adminRoutes from "./routes/admin.routes"

// const PORT = process.env.PORT || 3000;
const app = express(); 


app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.set("views", path.resolve(__dirname, "./views"));
app.use(express.static(path.resolve(__dirname, "./public")));
app.set('view engine', 'ejs');
connectDB()


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} 

app.use("/", homeRoutes)
app.use("/admin", adminRoutes)	


export default app;

