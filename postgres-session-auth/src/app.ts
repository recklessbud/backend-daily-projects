import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import lusca from 'lusca';
import flash from 'express-flash';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// import morgan from 'morgan';



//files and folders imports
import { morganMiddleware } from './middlewares/morgan.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import HomeRouter from "./routes/api/home.routes"
import './config/passport'
import AuthRouter  from "./routes/api/v1/auth.routes"
// import { link } from 'fs';



const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../src/views'));
if (process.env.NODE_ENV === 'development') {
    app.use(morganMiddleware);
}
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "keyboard cat",
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))

//auth middlewares
app.use(passport.initialize())
app.use(passport.session())
app.use(lusca.xframe("SAMEORIGIN"))
app.use(lusca.xssProtection(true))
app.use((req, res, next)=>{
    res.locals.user = req.user
    next()
})
app.use(flash());


//routes
app.use('/', HomeRouter)
//auth
app.use('/api/v1/auth', AuthRouter)


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});


export default app 