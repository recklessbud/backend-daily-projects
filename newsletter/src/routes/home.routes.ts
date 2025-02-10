import express from "express"
import * as home from  "../controllers/home.controller";

const router = express.Router();


router.get('/', home.homeController);
router.post('/subscribe', home.subscribe);
router.get('/unsubscribe/:email', home.unsubscribe);


export default router