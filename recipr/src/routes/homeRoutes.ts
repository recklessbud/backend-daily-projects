import express from "express";
import {isAuthenticated, isGuest} from "../middleware/authenticated";
const router = express.Router();
import { homepage } from "../controllers/home";
import Recipy = require("../models/recipySchema");
import { Users } from "../models/userSchema";
import { getAllRecipes, userBlogs, getSingleRecipe, deleteComment, postComments, displayComments} from "../controllers/recipeController";

router.get("/", isGuest, homepage)

router.get("/dashboard", isAuthenticated, async (req, res)=>{
    try{
        const user = req.user as Users;
        if(!user) return res.redirect("/api/v1/auth/login");
        const recipes = await Recipy.find({user: user.id}).lean();
        // if(!recipes) return res.redirect("/api/v1/auth/login");
    res.status(200).render("dashboard", {title: "Dashboard", user: req.user, recipes});
    }catch(err){
        console.error('Error fetching blogs:', err);
        res.status(500).render("dashboard",{ message: 'Internal Server Error' });
    }
}) 

router.get("/allrecipes", isAuthenticated, getAllRecipes) 

router.get('/users/:user/:id', isAuthenticated, userBlogs)

router.get("/recipes/:title/:id", isAuthenticated, getSingleRecipe)

router.post('/recipes/:id/comments', isAuthenticated, postComments)

router.post("/comments/:id", isAuthenticated, deleteComment)

router.get("/recipes/:title/:id", isAuthenticated, displayComments)

router.post("/:id", isAuthenticated, deleteComment)
// router.get('/allrecipes/:page', getPagnination)


export default router    