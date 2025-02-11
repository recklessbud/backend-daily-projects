import * as emailController from "../controllers/email.controller"
import express from "express"

const router = express.Router()

router.get('/dashboard', emailController.getDashboard)
router.post('/send-newsletter', emailController.sendNewsletter)

export default router