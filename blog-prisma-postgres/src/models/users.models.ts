import exp from "constants";
import prisma from "../config/db";

export const getAllUsers = async () =>{
    return await prisma.user.findMany({
      include: {
        post: true
      }
    });
}


export const createUser = async(username: string, password: string) =>{
  return await prisma.user.create({
    data: {
      username,
      password
    }
  })  
}

export const getUser = async(username: string) => {
  return await prisma.user.findUnique({
    where: {
      username
    }
  })
}

export const deleteUser = async(id: number) =>{
  return await prisma.user.delete({
    where: {
      id
    }
  })
}

export const updateUser = async(id: number, username: string, password: string) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        password,
        username
      }
    })
}