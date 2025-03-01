//express configure
import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import path from "path";
// import { Request, Response } from "express";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import lusca from "lusca";
import passport from "passport";
import session from "express-session"
// import mongoose, {mongoOptions} from "mongoose";
// import { ConnectMongoOptions } from "connect-mongo/build/main/lib/MongoStore";
import { MongoClientOptions } from "mongodb";
import MethodOverride from "method-override";
// import { createClient } from "redis"; 

const app = express();
dotenv.config({path:  path.resolve(__dirname, './config/.env')});

import connectDB from "./config/dbconn";
import * as passportConfig from "./config/passport";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from './routes/authRoutes';
import recipeRoutes from "./routes/recipeRoutes";
//middleware

connectDB()

// redisClient.on('error', (err)=>{
//     console.log(`Redis Client Error ${err}`);
// })


// redisClient.on('connect', ()=>{
//     console.log(`Redis Client Connected`);
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if(process.env.NODE_ENV === "development"){
app.use(logger("dev"));
// console.log("sss")
}
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(flash());
app.use(session({
    resave: false,
    saveUninitialized: false, 
    secret: process.env.SESSION_SECRET!,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI!,
        collectionName: "sessions",
        mongoOptions: {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
          } as MongoClientOptions
    }) 
})); 

app.use(MethodOverride("_method"));

// app.use((req, res, next) => {
//     console.log('Session Data:', req.session);
//     next();
// }); 
//passport configure
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use("/", homeRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recipes", recipeRoutes);
 
export default app