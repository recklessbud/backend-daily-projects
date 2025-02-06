import { Request, Response } from "express";
import * as post_models from '../models/posts.models';
import { postSchema } from "../middlewares/validation.middleware";


export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const post = await post_models.getAllPosts();
        res.status(200).json({post});
    } catch (error) {
        console.log(error)
    }
}

export const getPost = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const post = await post_models.getPost(Number(id));
        res.status(200).json({post});
    } catch (error) {
        console.log(error)
    }
}

export const createPost = async (req: Request, res: Response) => {
   const validatePost = postSchema.safeParse(req.body);

   if(!validatePost.success){
    throw new Error(JSON.stringify(validatePost.error.format()))
   }
   
    try{
    const create =  await post_models.createPost(validatePost.data);
    res.status(201).json({create});
    }catch(err){
        console.log(err)
    }
}

export const updatePost = async (req: Request, res: Response) => {
    const {id} = req.params
    const {title, body} = req.body
    try {
        const update = await post_models.updatePost(Number(id), title, body);
        res.status(200).json({update});
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const deletePost = await post_models.deletePost(Number(id));
        res.status(200).json({deletePost});
    } catch (error) {
        console.log(error)
    }
}