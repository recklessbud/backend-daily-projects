import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import prisma from "./dbconn";
import bcrypt from 'bcrypt'
// import {User } from "@prisma/client";


//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      return done(null, await prisma.user.findUnique({
        where: {
            id: id as string
        }
      }));
    } catch (error) {
      return done(error);
    }
  });


  passport.use(
    new LocalStrategy({usernameField: "username"}, async (username, password, done) => {
   try {
    const user = await prisma.user.findUnique({
        where:{
            username: username.toLowerCase()
        }
    })
    if (!user) {
        return done(undefined, false, {message: `Username ${username} not found`})
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
     
    if (!isValidPassword) {
        return done(undefined, false, { 
          message: "Invalid password" 
        });
      }

      return done(undefined, user)
   } catch (error) {
    return done(error)
   }  
}))