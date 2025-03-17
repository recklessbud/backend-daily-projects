const { successResponse } = require("../utils/responses.util")

module.exports = {
    getHome: (req, res) => {
        try {
            successResponse(res, 200).render('home');
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