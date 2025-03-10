/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import prisma from "../config/dbconn";
import { errorResponse, successResponse } from "../utils/responses.utils";
import { title } from "process";
import { logger } from "../utils/logger";



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

// export const getStudentsAssignPage = (req:Request, res:Response)=>{
//     successResponse(res, 200).render("users/admin/assignSupervisor", {title: "Assign supervisor"})
// }
// export const getUnassignedStudentsPage = (req:Request, res:Response)=>{
//     successResponse(res, 200).render("users/admin/unassignedStudents", {title: "Unassigned Students"})
// }
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
        logger.warn('Failed to fetch user', { 
            username: req.user?.username, 
            ip: req.ip, 
            reason: 'User not found' 

        });
        errorResponse(res, 404).render('errors/404', { title: 'Admin', message: 'User not found' });
    }
     logger.info('User fetched', {
         username: req.user?.username,
         ip: req.ip
     })
    successResponse(res, 200).render('users/admin/edit', { title: 'Admin', user: user, roles: roles });

}



export const updateUserRole = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { roleId } = req.body

    const user =  await prisma.user.findUnique({where: {id: userId}});
     if(!user){
        logger.warn('Failed to fetch user', { 
            username: req.user?.username, 
            ip: req.ip, 
            reason: 'User not found' 

        });
         errorResponse(res, 404).render('errors/404', {title: 'Admin', message: 'User not found'});
         return;
     }

     const updateUser =  await prisma.user.update({
        where: {id: userId},
        data: {
            roleId: roleId
        }
     })
     console.log(updateUser);
     logger.info('User role updated', {
         username: req.user?.username,
         ip: req.ip
        })
     successResponse(res, 200).redirect('/users/admin/dashboard');
} 

//schools
export const createSchool = async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
     if(name === "" || name === undefined){
        logger.warn('Failed to create school', { 
            username: req.user?.username, 
            ip: req.ip, 
            reason: 'School name is required' 

        });
         errorResponse(res, 400).json({message: 'School name is required'});
         return;
     } 
     const existingSchool = await prisma.school.findFirst(
        {
            where: {name: name}
    }
    );
    if(existingSchool){
        logger.warn('Failed to create school', {
            username: req.user?.username,
            ip: req.ip,
            reason: 'School already exists'
        })
        errorResponse(res, 400).json({message: 'School already exists'});	
        return;
    }
  const school = await prisma.school.create({
    data: {
        name: name
    }
  })
  console.log(school)
  successResponse(res, 201).json({message: 'School created successfully'});
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
    logger.info('School updated', {
        username: req.user?.username,
        ip: req.ip
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
    logger.info('School deleted', {
        username: req.user?.username,
        ip: req.ip
    })
    successResponse(res, 201).json({message: 'School deleted successfully'});
}
//faculties
export const createFaculty = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.body
    const { schoolId } = req.params
    if(name === "" || name === undefined){
        errorResponse(res, 400).json({message: 'Faculty name is required'});
    } 
    const existingFaculty = await prisma.faculty.findFirst(
        {
            where: {
                name: name,
                schoolId: schoolId
            }
    }
    );
    if(existingFaculty){
        errorResponse(res, 400).json({message: 'Faculty already exists'});	
        return;
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
 successResponse(res, 201).json({message: 'Faculty created successfully'});
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
    if(department === "" || department === undefined){
        errorResponse(res, 400).json({message: 'Department name is required'});
    }

    const existingDepartment = await prisma.department.findFirst(
        {
            where: {
                name: department,
                facultyId: facultyId
            }
    })
    if(existingDepartment){
        errorResponse(res, 400).json({message: 'Department already exists'});
        return;	
    }
   const departments = await prisma.department.create({ 
    data: {
        name: department,
        facultyId:facultyId
    }
   })
   console.log(departments);
   successResponse(res, 201).json({message: 'Department created successfully'});
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
//export const assignSupervisor = async(req: Request, res: Response, next: NextFunction) => {
//     const { projectId } = req.params
//     const { supervisorId } = req.body

//     const updatedSupervisor = await prisma.project.update({
//         where: {
//             id: projectId
//         },
//         data: {
//             supervisor: {
//                 connect: {
//                     id:supervisorId
//                 }
//             }
//         }
//     })
//     console.log(updatedSupervisor);
//     successResponse(res, 200).redirect('/users/admin/dashboard');
// }

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

export const getUnassignedStudents = async(req: Request, res: Response, next: NextFunction) => {
    const { departmentId } = req.params
    const students = await prisma.user.findMany({
        where: {
            departmentId: departmentId,
            role: {
                name: 'STUDENT'
            },
            supervisorId: null
        },
        select: {
            id: true,
            username: true,
            email: true,
            department: true,
            role: true
        }
    })
    successResponse(res, 200).render("users/admin/unassignedStudents", {title: "Unassigned Students", students: students});
}


export const getSupervisors = async(req: Request, res: Response, next: NextFunction) => {
   const { departmentId } = req.params

    const supervisors = await prisma.user.findMany({
        where: {
            departmentId: departmentId,
            role: {
                name: 'SUPERVISOR'
            }
        },
       include: {
          _count:{
            select:{
                students: true
            }
          }
       }
    })
    successResponse(res, 200).json({supervisors: supervisors});
}

export const assignSupervisor = async(req: Request, res: Response, next: NextFunction) => {
    const {studentId} = req.params
    const {supervisorId} = req.body


    const students = await prisma.user.update({
        where: {
            id: studentId,
        },
        data: {
            supervisorId: supervisorId
        },
        include: {
           supervisor: true, 
           department: true
        }
    });

    console.log(students);
    successResponse(res, 200).redirect('/users/admin/dashboard');
}

export const getStudentAssignPage = async(req: Request, res: Response, next: NextFunction) => {
    const { departmentId, studentId } = req.params
    const student = await prisma.user.findUnique({
        where: {
            id: studentId,
        },
        include: {
           department: true,
            }
    })

    const supervisors = await prisma.user.findMany({
        where:{
            departmentId: student?.departmentId,
            role:{
                name: 'SUPERVISOR'
            }
        },
        include:{
            _count: {
                select: {
                    students: true
                }
            }
        }
    })
    successResponse(res, 200).render('users/admin/assignSupervisor', {title: 'Assign Supervisor', student: student, supervisors: supervisors});
}