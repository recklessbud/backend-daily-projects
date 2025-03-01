import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, { message: "Username should be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
});

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3, { message: "Username should be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
    // role: z.enum(["ADMIN", "STUDENT", "SUPERVISOR", "SUPER_ADMIN"]),
    schoolId: z.string(),
    facultyId: z.string(),
    departmentId: z.string(),
})


export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;