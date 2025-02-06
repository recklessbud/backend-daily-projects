// import { title } from "process"
// import exp from "constants"
import { z } from "zod"
// import { Request, Response, NextFunction } from "express"

export const userSchema = z.object({
    username: z.string(),
    password: z.string().min(6).max(20)
})

export const postSchema = z.object({
    title: z.string(),
    body: z.string().min(10),
    authorId: z.number()  
})

export type PostInput = z.infer<typeof postSchema>

export type UserInput = z.infer<typeof userSchema>

