/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { successResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";


export const getSupervisorPage = (req: Request, res: Response) => {
    successResponse(res, 200).render('users/supervisor/dashboard', {title: 'Supervisor', user: req.user});
}

export const getAllProjects = async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
        where: {
            supervisorId: req.user?.id
        },
        include: {
            student: true,
            supervisor: true,
            // comments: true
            
        }
    })
    console.log(projects);
    successResponse(res, 200).render('projects/projects', {title: 'Projects', projects: projects, user: req.user});
}	    