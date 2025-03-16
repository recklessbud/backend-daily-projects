import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

interface Payload {
    id: string, 
    username: string
}

export const generateResetToken = (user: Payload) => {
    if(!process.env.RESET_TOKEN_SECRET){
        throw new Error("RESET_TOKEN_SECRET is not defined");
    }

    return jwt.sign({id: user.id, username: user.username}, process.env.RESET_TOKEN_SECRET as string, {expiresIn: "15m"});
}


// export const verifyResetToken = (token: string) => {}