/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import { getFileUrl } from "../services/awsS3.services";



// export const getSupervisorPage = async(req: Request, res: Response) => {
//     const user = await prisma.user.findUnique({
//         where: {
//             id: req.user?.id
//         }, 
//         include: {
//             role: true,
//             department: true,
//             faculty: true
//         }
//     });
//     console.log(user);
//     successResponse(res, 200).render('users/supervisor/dashboard', {title: 'Supervisor', user: user});
// }
  



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
    // successResponse(res, 200).render('users/supervisor/dashboard', {students: students})
}

export const reviewProject = async (req: Request, res: Response) => {
    const { projectId } = req.params
    const { status, comments } = req.body

    const project = await prisma.project.update({
        where: {
            id: projectId,
            student:{
                supervisorId: req.user?.id
            }
        }, 
        data: {
            status: status,
            comments: comments
            // reviewedAt: new Date()
        },
        include: {
            student: true,
            topic: true
        }
    })
    successResponse(res, 200).json({ project });
}



export const reviewProjectTopic = async (req: Request, res: Response) => {
    const { topicId } = req.params
    const { status, comments } = req.body

    const topic = await prisma.projectTopic.update({
        where: {
            id: topicId,
            student: {
                supervisorId: req.user?.id
            }
        },
        data: {
            status: status,
            comments: comments
            // reviewedAt: new Date()
        },
        include: {
            student: true,

        }
    })
    successResponse(res, 200).json(topic);
}

export const downloadProject = async (req: Request, res: Response) => {
    const { projectId } = req.params
   
    const project = await prisma.project.findUnique({
      where:{
        id: projectId,
        student: {
          supervisorId: req.user?.id
        }
      },
      include: {
        student: true
      }
   })

   if(!project){
    errorResponse(res, 404).json({message: 'Project not found'});
    return
   }

   if (!project.fileKey) {
    errorResponse(res, 404).json({  message: 'File not found'});
    return
} 

  const downloadFile = await getFileUrl(project.fileKey)

  successResponse(res, 200).json({message: 'File downloaded successfully',
     downloadFile: downloadFile, 
    fileName: project.fileName
  });
}

export const getProjects = async(req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
        where: {
            student: {
                supervisorId: req.user?.id
            }
        },
        include: {
            student: true
        }
    })

    successResponse(res, 200).render('users/supervisor/dashboard', {title: 'Projects', projects: projects});
}