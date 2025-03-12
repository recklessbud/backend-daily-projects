// import { title } from "process"
import { successResponse } from "../utils/responses.utils"


export const homeController = (req, res) =>{
    successResponse(res, 200).render("home", {title: "Home"})
}