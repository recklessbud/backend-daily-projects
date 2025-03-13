import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import prisma from "./dbconn";
import bcrypt from 'bcrypt'
import { User } from "@prisma/client";


//
passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        
        if (!user) {
            return done(new Error('User not found'));
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});


  // Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};



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

export {hashPassword}