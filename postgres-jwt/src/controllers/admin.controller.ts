/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import prisma from "../config/dbconn";
import { errorResponse, successResponse } from "../utils/responses.utils";
import exp from "constants";


export const getAdminPage = async(req: Request, res: Response, next: NextFunction) => {
    const admin = await prisma.user.findUnique({where: {id: req.user?.id}})
    const users = await prisma.user.findMany({
        where:{
            role: {
                NOT: {
                    name: {in: ['SUPER_ADMIN', 'ADMIN']}
                }
            }
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true
        },
    })
    successResponse(res, 200).render('users/admin/dashboard', {title: 'Admin', users: users, admin: admin});
}

export async function getEditPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            role: true
        }
    });
    const roles = await prisma.role.findMany();
    if (!user) {
        errorResponse(res, 404).render('errors/404', { title: 'Admin', message: 'User not found' });
    }
    successResponse(res, 200).render('users/admin/edit', { title: 'Admin', user: user, roles: roles });

}



export const updateUserRole = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { roleId } = req.body

    const user =  await prisma.user.findUnique({where: {id: userId}});
     if(!user){
        return errorResponse(res, 404).render('errors/404', {title: 'Admin', message: 'User not found'});
     }

     const updateUser =  await prisma.user.update({
        where: {id: userId},
        data: {
            roleId: roleId
        }
     })
     console.log(updateUser);
     successResponse(res, 200).redirect('/users/admin/dashboard');
} 

//schools
export const createSchool = async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
     if(name === "" || name === undefined){
         errorResponse(res, 400).render('errors/400', {title: '400 - Bad Request', message: 'Bad Request'});
     } 
  const school = await prisma.school.create({
    data: {
        name: name
    }
  })
  console.log(school)
  successResponse(res, 201).redirect('/users/admin/dashboard');
}
export const updateSchool = async(req: Request, res: Response, next: NextFunction) => {
    const { schoolId } = req.params
    const { name } = req.body

    const updateSchool =  await prisma.school.update({
        where: {
            id: schoolId
        },
        data: {
            name: name
        }
    })
    successResponse(res, 200).redirect('/users/admin/dashboard');
}
export const deleteSchool = async(req: Request, res: Response, next: NextFunction) => {
    const { schoolId } = req.params
    const deleteSchool =  await prisma.school.delete({
        where: {
            id: schoolId
        }
    })
    successResponse(res, 201).json({message: 'School deleted successfully'});
}
//faculties
export const createFaculty = async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
    const { schoolId } = req.params
    if(name === "" || name === undefined){
        errorResponse(res, 400).render('errors/400', {title: '400 - Bad Request', message: 'Bad Request'});
    } 
     const faculties = await prisma.faculty.create({
        data: {
            name: name,
            school: {
                connect: {
                    id: schoolId
                }
            }
        },
     })
     console.log(faculties);
 successResponse(res, 201).redirect('/users/admin/dashboard');
}
export const updateFaculty = async(req: Request, res: Response, next: NextFunction) => {
    const {name} = req.body
    const { facultyId } = req.params
    const updateFaculty =  await prisma.faculty.update({
        where: {
            id: facultyId
        },
        data: {
            name: name
        }
    })
    console.log(updateFaculty);
    successResponse(res, 200).redirect('/users/admin/dashboard');
}
export const deleteFaculty = async(req: Request, res: Response, next: NextFunction) => {
    const { facultyId } = req.params
    const deleteSchool =  await prisma.faculty.delete({
        where: {
            id: facultyId
        }
    })
    console.log(deleteSchool);
    successResponse(res, 200).json({message: 'Faculty deleted successfully'});
}

//departments
export const createDepartment = async(req: Request, res: Response, next: NextFunction) => {
    const { department } = req.body
    const { facultyId } = req.params
   const departments = await prisma.department.create({ 
    data: {
        name: department,
        facultyId:facultyId
    }
   })
   console.log(departments);
   successResponse(res, 201).redirect('/users/admin/dashboard');
}
export const updateDepartment = async(req: Request, res: Response, next: NextFunction) => {
    const {name} = req.body
    const { departmentId } = req.params
    const updateDepartment =  await prisma.department.update({
        where: {
            id: departmentId
        },
        data: {
            name: name
        }
    })
    console.log(updateDepartment);
    successResponse(res, 200).redirect('/users/admin/dashboard');
}
export const deleteDepartment = async(req: Request, res: Response, next: NextFunction) => {
    const { departmentId } = req.params
    const deleteDepartment =  await prisma.department.delete({
        where: {
            id: departmentId
        }
    })
    console.log(deleteDepartment);
    successResponse(res, 200).json({message: 'Department deleted successfully'});
}

//supervisors
export const assignSupervisor = async(req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params
    const { supervisorId } = req.body

    const updatedSupervisor = await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            supervisor: {
                connect: {
                    id:supervisorId
                }
            }
        }
    })
    console.log(updatedSupervisor);
    successResponse(res, 200).redirect('/users/admin/dashboard');
}

//Projects
export const getProjects = async(req: Request, res: Response, next: NextFunction) => {
    const projects = await prisma.project.findMany({
        include: {
            student: true,
            supervisor: true,
            // comments: true
            
        }
    })
    console.log(projects);
    successResponse(res, 200).render('projects/projects', {title: 'Projects', projects: projects});
}