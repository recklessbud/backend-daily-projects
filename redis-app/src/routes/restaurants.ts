import { Router } from "express";
const router = Router();


router.get('/', (req, res) => {
    res.send('Restaurants')
})

export default router



