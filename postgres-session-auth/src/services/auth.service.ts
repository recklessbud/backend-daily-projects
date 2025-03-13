import { randomBytes } from "crypto";
import prisma from "../config/dbconn";
import { hashPassword } from "../config/passport";
import {  Register } from "../utils/validator.utils";




interface SessionData {
    userId: string;
    userAgent?: string;
    ipAddress?: string;
  }

  
export class AuthService {
    static async createUser(userData: Register) {
    const hashedPassword = await hashPassword(userData.password);
        return prisma.user.create({
            data: {
               username: userData.username.toLowerCase(), 
               email: userData.email.toLowerCase(), 
               password: hashedPassword
            }
        });
    }

    static async findUser(username: string, email: string) {
        return prisma.user.findUnique({
            where: {
                username,
                email
            }
        });
    }

  static async session(sessionData: SessionData) {
   try{
    const token = randomBytes(64).toString('hex');
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    return await prisma.session.create({
        data: {
            userId: sessionData.userId,
            token: token,
            expiresAt: new Date(Date.now() + ONE_WEEK),
        }
    });
   }
   catch(error){
    console.log(error)
    throw new Error(`Failed to create session: ${error}`)
   }
  }

 static async deleteSession(userId: string) {
    return await prisma.session.deleteMany({
        where: {
            userId: userId
        }
    });
  }









}
