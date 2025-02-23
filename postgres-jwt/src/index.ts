// dependencies
import "express-async-errors"
import app from './app';
import dotenv from 'dotenv';


//config
dotenv.config();
//port environment variable
const PORT = process.env.PORT || 3000;



//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}) 
.on('error', (error) => {
    console.log(error);
})