import prisma from "../config/db";
import {postSchema, PostInput} from '../middlewares/validation.middleware'


export const getAllPosts = async () => {
    return await prisma.post.findMany();
}

export const createPost = async (data: PostInput) => {
    const validatePost = postSchema.safeParse(data);
    if(!validatePost.success)
    {
        throw new Error(JSON.stringify(validatePost.error.format()))
    }
    return await prisma.post.create({data: validatePost.data})
}

export const getPost = async (id: number) => {
    return await prisma.post.findUnique({
        where: {
            id
        }
    })
}

export const updatePost = async (id: number, title: string, body: string) => {
    return await prisma.post.update({
        where: {
            id
        },
        data: {
            title,
            body
        }
    })
}

export const deletePost = async (id: number) => {
    return await prisma.post.delete({
        where: {
            id
        }
    })
}