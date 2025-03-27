import PrismaInstance from "../config/database.config"

let prismaPromise: Promise<any>;

export const prismaDb = ()=>{
    if(!prismaPromise){
        prismaPromise = PrismaInstance()
    }
    return prismaPromise
}