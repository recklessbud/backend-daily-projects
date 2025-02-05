import * as users from '../models/users.models';
import { Request, Response } from 'express';


export const getAllUsers = async (req: Request, res: Response) => {
 try {
    const user =  await users.getAllUsers();
    res.status(200).json({user});
 } catch (error) {
    console.error('error at', error)
 }
}

export const getUsers = async (req: Request, res: Response) => {
    const {username} = req.params
    try {
        if (!username) {
            res.status(400).json({message: "username is required"});
        }else{
            const user = await users.getUser(username);
            res.status(200).json({user});
        }
    } catch (error) {
        console.error(error)
    }
}

export const createUsers = async (req: Request, res: Response) => {
    const {username, password} = req.body
    try {
        const create = await users.createUser(username, password);
    res.status(201).json({create});
    } catch (error) {
        console.error(error)
    }
}


export const updateUsers = async (req: Request, res: Response) => {
    const {username, password} = req.body
    const { id } = req.params
    try {    
        const update = await users.updateUser(Number(id), username, password);
        res.status(200).json({update});
    }catch (error) {
        console.error(error)
    }
}

export const deleteUsers = async(req: Request, res: Response) => {
    const {id} = req.params
    try {
        const deleteUsers = await users.deleteUser( Number(id) );
        res.status(200).json({deleteUsers});
    } catch (error) {
        console.error(error)
    }
}