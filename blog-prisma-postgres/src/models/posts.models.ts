import prisma from "../config/db";


export const getAllPosts = async () => {
    return await prisma.post.findMany();
}

export const createPost = async (title: string, body: string, authorId: number) => {
    return await prisma.post.create({
        data: {
            title, 
            body,
            author:{
                connect:{
                    id: authorId
                }
            }
        }
    })
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