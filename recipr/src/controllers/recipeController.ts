import Recipy from "../models/recipySchema";
import { User, Users } from "../models/userSchema";
import cloudinary, { image, search }  from "../middleware/cloudinary";
import { Request, Response, NextFunction } from "express";
import comment from "../models/commentModel";
import NodeCache from "node-cache";
import { now } from "mongoose";

const recipeCache = new NodeCache({stdTTL: 60});

export const getPostRecipe = (req: Request, res: Response):void => {
    res.render("recipes/create", {title: "Recipe", user: req.user});
}

export const getEditRecipe = async(req: Request, res: Response) :Promise<void> => {
    try{
      const user = req.user as Users;
      const recipe = await Recipy.findOne({_id: req.params.id}).lean();
      if(!recipe){
        res.status(404).render("dashboard", {message: "Recipe not found"});
      }
    if(recipe?.user.toString() !== user.id){
        res.status(403).render("dashboard", {message: "You are not authorized to edit this recipe"});}  
        else{
            res.render("recipes/edit", {title: "Edit Recipe ✍️", user: req.user, recipe: recipe});
        }  
    }catch(err){
    console.log(err)
    res.status(500).render("dashboard", {message: "Internal server error"})
    }
}

//  export const getAllRecipesPage = (req: Request, res: Response):void => {
//     res.render("recipes/allrecipes", {title: "All Recipes", user: req.user});
//  }




export const postRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as Users;
      req.body.user = user._id;
      const {title, description, ingredients, instructions} = req.body;
       if(!title || !description || !ingredients || !instructions) {
         res.status(400).json({message: "All fields are required"});
       }
       const results = await cloudinary.uploader.upload((req as any).file.path);
       const ingredientsArray = ingredients.split('\n').filter((line: string) => line.trim() !== '');
       const instructionsArray = instructions.split('\n').filter((line: string) => line.trim() !== '');

       const recipe = await Recipy.create({
        ...req.body,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        cloudinaryId: results.public_id, 
        image: results.secure_url
    });
      if(!recipe){
        res.status(400).json({message: "Failed to create recipe"});
      }
      res.status(201).redirect("/dashboard");
    }catch (err) {
      console.log(err)
      next(err);
    }
}

export const updateRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as Users;
      const {id} = req.params;
      const image = req.file ? req.file.path : null;
      const results = await cloudinary.uploader.upload((req as any).file.path);
      let recipes = await Recipy.findById(id).lean();
       if(!recipes){
        res.status(404).render("dashboard", {message: "Recipe not found"});
       }

       if(recipes?.user.toString() !== user.id){
        res.status(403).render("dashboard", {message: "You are not authorized to edit this recipe"});
       }else{
      const updateRecipe = {
        ...req.body,
        image: results.secure_url || recipes?.image,
        cloudinaryId: results.public_id

      }
        recipes = await Recipy.findByIdAndUpdate(
            id, 
            updateRecipe,
            {new: true, runValidators: true});
        res.status(201).redirect("/dashboard");
       }
    //    console.log("updated", req.file)

    }
    catch(err){
        console.log(err)
        next(err);
        res.status(500).render("dashboard", {message: "Internal server error"})
    }
}


export const deleteRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {id} = req.params;
    const user = req.user as Users;

    try {
      let recipes = await Recipy.findById(id).lean();
      if(!recipes){
        res.status(404).render("dashboard", {message: "Recipe not found"});
      }
      if(recipes?.user.toString() !== user.id){
        res.status(403).render("dashboard", {message: "You are not authorized to delete this recipe"});
      }else{
        await cloudinary.uploader.destroy(recipes!.cloudinaryId);
        await Recipy.deleteOne({_id: id})
        res.status(201).redirect("/dashboard");
      }
    } catch (error) {
        console.log(error)
            res.status(500).render("dashboard", {message: "Internal server error"})
    } 
}



export const getAllRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const user = req.user as Users;
    try{ 
      const {page = 1, limit = 3, search = "" }= req.query
      const searchQuery = search ? { title: { $regex: search, $options: 'i' } } : {};
      const cacheKey =  `allrecipes:${page}:${limit}:${search}`;
        const recipes = await Recipy.find(searchQuery)
        .lean()
        .populate("user")
        .sort({createdAt: -1})
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

       const cachedRecipes = recipeCache.get(cacheKey);
        if (cachedRecipes) {
            console.log("Serving from cache");
            return res.status(200).render("recipes/allrecipes", {
                title: "All Recipes",
                user: req.user,
                recipes: cachedRecipes,
                totalPages: Array.isArray(cachedRecipes) ? Math.ceil(cachedRecipes.length / Number(limit)) : 0,
                currentPage: Number(page),
                search // Pass the search term to the view if needed
            });
        }
        const user = req.user as Users;
      
         const total = await Recipy.countDocuments(searchQuery);
          const totalPages = Math.ceil(total / Number(limit));
   
          recipeCache.set(cacheKey, recipes);
       

        res.status(200).render("recipes/allrecipes", {
          title: "All Recipes",
           user: req.user , 
          recipes, 
          totalPages, 
          currentPage: Number(page), 
          search });
    }
 
    catch(err){
        console.log("console-log", err)
        res.status(500).redirect("/dashboard")
    } 
}	


export const userBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as Users;
    try{
        const recipes = await Recipy.find({user: req.params.id})
        .lean()
        .populate("user")
        .sort({createdAt: -1});
        res.status(200).render("recipes/allrecipes", {title: "All Recipes", user: req.user , recipes: recipes});
    }
 
    catch(err){
        console.log("console-log", err)
        res.status(500).redirect("/dashboard")
    }
}




export const getSingleRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 const user = req.user as Users;
  const {id} = req.params;
  try{  
 
    const recipes = await Recipy.findOne({_id: id}).lean().populate("user");
  const comments = await comment.find({recipe: id}).lean().populate("user", "username").sort({createdAt: -1});
    if(!recipes){
      console.log("unsave")
      res.status(404).render("dashboard", {message: "Recipe not found"});
  }
  console.log("Recipe Data:", comments);

     res.status(200).render("recipes/show", {title: "Recipe", user: req.user, recipes, comments});
} 
  catch(err){
    console.log(err) 
    res.status(500).render("dashboard", {message: "Internal server error"})
  }
} 


export const postComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user as Users;
  const {id} = req.params;
  const {content} = req.body;
  if(!content){
    res.status(400).render("recipes/show", {message: "All fields are required"});
  }
  try{
    const recipes = await Recipy.findOne({_id: id}).lean().populate("user");
    if(!recipes){
      res.status(404).render("dashboard", {message: "Recipe not found"});
    }

    const newComment = await comment.create({
      content,
      user: user._id,
      recipe: id
    })
    await Recipy.findOneAndUpdate(
      {_id: id},
      {$push: {comments: newComment._id}},
      {new: true}
    )
    res.status(201).redirect(`/recipes/${recipes?.title}/${id}`);

  }
  catch(err){
     console.log("err", err)
     res.status(500).render("dashboard", {message: "Internal server error"})
  }
}

export const displayComments = async (req: Request, res: Response): Promise<void> => {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipy.findById(recipeId)
      .populate('user', 'username') // Populate recipe creator
      .populate({
        path: 'comment', 
        populate: { path: 'user', select: 'username' } // Populate user inside comments
      });

    if (!recipe) {
     res.status(404).send('Recipe not found');
     return;
    }

    console.log("Fetched Recipe:", JSON.stringify(recipe, null, 2)); // Debugging
    res.render('recipes/show', { recipe, user: req.user });

  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).send('Internal Server Error');
  }
};



export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const commentId = req.params.id;
  const userId = req.user as Users; // Assuming you have user authentication

  try {
    // Find the comment
    // const recipe = await Recipy.findOne({ _id:  });
    const comments = await comment.findOne({_id: commentId});

    // Check if the comment belongs to the user
    if (!comments || !comments.user || comments.user.toString() !== userId.id) {
       res.status(403).send('You are not authorized to delete this comment');
    }

    // Delete the comment
    await comment.findByIdAndDelete(commentId);

    // Remove the comment from the recipe
    if(comments?.recipe){
      await Recipy.findByIdAndUpdate(comments.recipe, {
      $pull: { comments: commentId },
    });
    }
    res.redirect(`/recipes/${comments?.recipe}/${comments?.recipe}`);
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Internal Server Error');
  }

};

// export const getPagnination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try{
//     const {page = 1, limit = 5 }= req.query
//   const user = req.user as Users;
//    const recipes = await Recipy
//    .find()
//    .lean()
//    .populate('user')
//    .sort({createdAt: -1})
//    .skip((Number(page) - 1) * Number(limit))
//    .limit(Number(limit));

//    const total = await Recipy.countDocuments();
//     const totalPages = Math.ceil(total / Number(limit));

//     res.render('recipes/allrecipes', {recipes, user, totalPages, currentPage: Number(page) });

//   }catch(err){
//     console.log(err)
//     res.status(500).render("dashboard", {message: "Internal server error"})
//   }
// }