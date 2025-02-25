import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

async function main() {
    const roles =["ADMIN", "USER", "MODERATOR"]

    for(const role of roles){
        await prisma.role.upsert({
            where: {
                name: role
            },
            update: {},
            create: {
                name: role
            }
        })
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            username: "bossman"
        }
    })
    if(!existingUser){
        const hashedPassword = await bcrypt.hash("bossman12", 10)
        await prisma.user.create({
            data: {
                username: "bossman",
                email: "admin12@gmail.com",
                password: hashedPassword,
                role: {
                    connect: {
                        name: "ADMIN"
                    }
                }
            }
        })
        console.log("user created")	
    }
    console.log("seed running")
}


main()
 .catch((e) => {
    const err = e as Error;
    console.log("error occurred:", err)
 })
 .finally(()=> prisma.$disconnect())