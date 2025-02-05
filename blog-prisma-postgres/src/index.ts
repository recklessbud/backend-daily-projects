 import express from "express";
 import cors from "cors";
 import morgan from "morgan";
// import { cp } from "fs";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 5040;


 //Express Middleware
 const app = express();
 app.use(morgan('dev'));
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cors());

 //Routes
 app.use('/api/users', userRoutes)
 app.use('/api/posts', postRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})