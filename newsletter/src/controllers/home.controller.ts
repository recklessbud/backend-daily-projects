import { Request, Response } from "express";
import emailSchema  from "../models/user.models";
import { sendEEmail } from "../utils/sendEmail";

export const homeController = (req: Request, res: Response) => {
    res.render('index', { title: "home" });
}

// console.log(emailModel)

export const subscribe = async (req: Request, res: Response) => {
    const {email, frequency} = req.body;
    try {
        const emailExists = await emailSchema.findOne({email});
      if(emailExists){
        res.status(400).send("email already exists")
      }
     const newEmail = await emailSchema.create({email, frequency});
     await newEmail.save();
     const unsubscribeLink = `${process.env.BASE_URL}/unsubscribe/${email}`;
     const text = ` <h2>Welcome to Our Newsletter!</h2>
                <p>You have subscribed to our ${frequency} newsletter.</p>
                <p>If you wish to unsubscribe, click the link below:</p>
                <a href="${unsubscribeLink}">Unsubscribe</a>
                <p>Thank you for subscribing to our newsletter!</p>`;
    await sendEEmail(email, "Welcome to our newsletter", text)

     res.status(201).send("email subscribed successfully")
    } catch (error) {
        console.log(error)
        res.status(500).send("something went wrong")
    }

}

export const unsubscribe = async (req: Request, res: Response) => {
    const {email} = req.params;
    try {
        const deletedEmail = await emailSchema.findOneAndDelete({email});
        if(!deletedEmail){
            res.status(404).send("email not found")
        }
       const text = `
                <h2>We're sad to see you go!</h2>
                <p>Your email has been removed from our newsletter list.</p>
                <p>If this was a mistake, you can <a href="${process.env.BASE_URL}">subscribe again</a>.</p>
            `
        await sendEEmail(email, "Goodbye from our newsletter", text)
        res.status(200).send("email unsubscribed successfully")
    } catch (error) {
        console.log(error)
        res.status(500).send("something went wrong")
    }
}