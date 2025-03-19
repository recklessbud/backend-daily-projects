const { count } = require("console");
// const { fileOps } = require("../utils/fileOps.utils");
const { successResponse } = require("../utils/responses.util");
const { scrape } = require("../helper/scrape.helper");
const { scrapeUrl} = require("./product.controller");
const { fileOps } = require("../utils/fileOps.utils");

module.exports = {
    getHome: async(req, res) => {
        try {
            // const products = await fileOps.readData();
            await fileOps.init();
            const products = await Promise.race([
                fileOps.readData(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 6000))
            ]);
            console.log(products)
            successResponse(res, 200).json({ products, success: true , count: products.length});
        } catch (error) {
            console.error('View rendering error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getLogin: (req, res)=>{
        try {
            successResponse(res, 200).render('auth/login')
        } catch (error) {
            console.error('View rendering error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
} 