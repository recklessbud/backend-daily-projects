/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { successResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";


export const getSupervisorPage = async(req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }, 
        include: {
            role: true,
            department: true,
            faculty: true
        }
    });
    console.log(user);
    successResponse(res, 200).render('users/supervisor/dashboard', {title: 'Supervisor', user: user});
}

export const getAllProjects = async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
        where: {
            supervisorId: req.user?.id
        },
        include: {
            student: true,
            supervisor: true,
            // comments: true{}
            
        }
    })
    console.log(projects);
    // successResponse(res, 200).render('projects/projects', {title: 'Projects', projects: projects, user: req.user});
}	  


export const getProjectTopics = async (req: Request, res: Response) => {
    const topics = await prisma.projectTopic.findMany({
        where: {
            projects: {
                some: {
                    supervisorId: req.user?.id
                }
            }
        },
        select: {
            
            title: true
        }
    })
}
export const getSingleProject = async (req: Request, res: Response) => {
    const { projectId, studentId } = req.params

    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        },
        include: {
            student: true,
            supervisor: true,
            // comments: true{}
            
        }
    })
    console.log(project);
    // successResponse(res, 200).render('projects/projects', {title: 'Projects', projects: projects, user: req.user});
}

export const getStudents = async (req: Request, res: Response) => {
    const { departmentId } = req.params

    const students = await prisma.user.findMany({
        where: {
            role: {
                name: 'STUDENT'
            },
            departmentId: departmentId
        },
        select:{
            id: true,
            username: true,
            email: true
        }
    })
    successResponse(res, 200).json({
        students: students
    });
}

export const getDepartments = async (req: Request, res: Response) => {
    const someId = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }
    })

    const students = await prisma.user.findMany({
        where: {
            departmentId: someId?.departmentId,
            role: {
                name: 'STUDENT'
            }
        },
        select: {
            id: true,
            username: true,
            email: true
        }
    })

    successResponse(res, 200).json({
       students: students,
       message: 'Success'
    });
}

export const approveProjects = async (req: Request, res: Response) => {
    const { projectId } = req.params

    const project = await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            status: 'APPROVED',
            comments: 'Approved by supervisor'
        }
    })
    successResponse(res, 200).json({message: 'Project approved successfully'});
}



export const rejectProjects = async (req: Request, res: Response) => {
    const { projectId } = req.params
    const { comments } = req.body

    const project = await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            status: 'REJECTED',
            comments: comments
        }
    })
    successResponse(res, 200).json({message: 'Project rejected successfully'});
}




export const getAssignedStudents = async (req: Request, res: Response) => {
    const students = await prisma.user.findMany({
        where:{
            supervisorId: req.user?.id,
            role: {
                name: 'STUDENT'
            }
        },
        include: {
            department: true,
            studentsProjects: true,
            studentsTopic: {
                where: {
                    status: {
                        in: ['PENDING', 'APPROVED']
                    }
                }   
            },

        }
    })
    successResponse(res, 200).json(students);
}