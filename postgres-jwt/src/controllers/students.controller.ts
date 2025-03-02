/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import {  successResponse, errorResponse } from "../utils/responses.utils";
import { ProjectTopic } from "../utils/validation.utils";
import prisma from "../config/dbconn";
import { upload } from "../config/multer.config";
import { uploadFile, getFileUrl, deleteFile } from "../services/awsS3.services";


export const getStudentPage = (req: Request, res: Response) => {
    successResponse(res, 200).render('users/students/dashboard', {title: 'Students', user: req.user});
};

export const createProjectTopic = async(req: Request, res: Response) => {
    const { title } = req.body as ProjectTopic
    const user = await prisma.user.findUnique(
        {
            where: {
            id: req.user?.id,
            role: {
                name: "STUDENT" 
            }
        },
        include: {
            studentsProjects: true,
            studentsTopic: true
        }
    })
    console.log(user);
    if (!user) {
       errorResponse(res, 404).render('errors/404', {title: 'Students', message: 'User not found'});
         return 
    }

    if(user.studentsTopic.length > 0){
        errorResponse(res, 400).json({message: 'You have already created a project topic'});
        return;
    }

    const projectTopic = await prisma.projectTopic.create({
        data: {
            title: title.trim(),
            student: {
                connect: {
                    id: req.user?.id
                }
            },
            status: 'PENDING',
        }
    })
    successResponse(res, 201).json({message: 'Project topic created successfully', projectTopic: projectTopic});
}


export const deleteProjectTopic = async(req: Request, res: Response) => {
    const {projectTopicId} = req.params

    const user = await prisma.user.findUnique(
        {
            where: {
            id: req.user?.id,
            role: {
                name: "STUDENT" 
            }
        },
        include: {
            studentsProjects: true,
            studentsTopic: true
        }
    })
    console.log(user);
    if (!user) {
       errorResponse(res, 404).render('errors/404', {title: 'Students', message: 'User not found'});
         return 
    }
     
   if(user.studentsTopic.length === 0){
    errorResponse(res, 400).json({message: 'You have not created a project topic'});
    return
   }
   const deleteTopic = await prisma.projectTopic.delete({
    where: {
        id: projectTopicId
    }
   })
   successResponse(res, 201).json({message: 'Project topic deleted successfully', deleteTopic: deleteTopic});

}

export const updateProjectTopic = async(req: Request, res: Response) => {
    const { projectTopicId } = req.params
    const { title } = req.body as ProjectTopic

    const user = await prisma.user.findUnique(
        {
            where: {
            id: req.user?.id,
            role: {
                name: "STUDENT" 
            }
        },
        include: {
            studentsTopic: {
                where: {
                    id: projectTopicId
                }
            }
        }
    })
    console.log(user);
    if (!user) {
       errorResponse(res, 404).render('errors/404', {title: 'Students', message: 'User not found'});
         return 
    }
     
   if(user.studentsTopic.length === 0){
    errorResponse(res, 404).json({message: 'You have not created a project topic'});
    return
   }

   const findTopic = await prisma.projectTopic.findFirst({
    where: {
        id: projectTopicId,
        status: 'PENDING',	
        studentId: req.user?.id
    }
   })
   if(!findTopic){
    errorResponse(res, 404).json({message: 'Project topic not found'});
    return
   }
   const updateTopic = await prisma.projectTopic.update({
    where: {
        id: projectTopicId,
    },
    data: {
        title: title.trim(),
        updatedAt: new Date()
    }
   })
   successResponse(res, 201).json({message: 'Project topic updated successfully', updateTopic: updateTopic});

}


export const createProjects = async(req: Request, res: Response) => {
  if(!req.file){
    errorResponse(res, 400).json({message: 'Please upload a file'});
    return
}

 const student = await prisma.user.findUnique({
    where: {
        id: req.user?.id,
        role: {
            name: "STUDENT"
        }
       },
       include: {
        studentsTopic: {
            where: {
                status: 'PENDING' //change to approved later
            }
        }
    }
 })

 if(!student){
    errorResponse(res, 404).render('errors/404', {title: 'Students', message: 'User not found'});
    return
}

if (student.studentsTopic.length === 0) {
    errorResponse(res, 400).json({message: 'You must have an approved project topic before uploading project files'});
    return
}

const key = `projects/${req.user?.id}/${Date.now()}-${req.file.originalname}`

const fileUrl = await uploadFile(req.file, key)

const project = await prisma.project.create({
    data:{
        fileKey: key,
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        student: {
            connect: {
                id: req.user?.id
            }
        },
        topic:{
            connect: {
                id: student.studentsTopic[0].id
            }
        },
        status: 'PENDING',
        comments: 'Pending approval'
    }
})
successResponse(res, 201).json({message: 'Project created successfully', project: project});

}