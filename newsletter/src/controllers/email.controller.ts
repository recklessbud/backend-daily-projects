import emailModel from "../models/email.models"
import { Request, Response } from "express";
import { sendEEmail } from "../utils/sendEmail";
import emailSchema from "../models/user.models";
// import emailModels from "../models/email.models";




export const getDashboard = async(req: Request, res: Response) => {
    try {
        const subscribers = await emailSchema.find({isSubscribed: true})
        .lean()
        const sentEmails = await emailModel.find()
        .sort({sentAt: -1})
        .lean()
        .populate('recipients')
        res.render('admin/dashboard', {subscribers, sentEmails})
        
    } catch (error) {
        console.error(error)
        res.status(500).send("something went wrong")
    }
}



export const sendNewsletter = async (req: Request, res: Response):Promise<void> => {
    const {subject, content} = req.body  
    try {
        const subscribers = await emailSchema.find({}, "email")
        if(!subscribers || subscribers.length === 0){
          res.status(400).send("no selected subscribers")
        }
        const emailRecord = await emailModel.create({
            subject, 
            content, 
            recipients: subscribers
        })
        const text = `<p>${content}</p>`
        for (const subscriber of subscribers) {
            await sendEEmail(subscriber.email, subject, text)
        }
        res.status(201).send("email sent successfully")
    } catch (error) {
        console.log(error)
        res.status(500).send("something went wrong")
    }
}