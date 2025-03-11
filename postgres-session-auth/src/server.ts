import app from './app';
import dotenv from 'dotenv';
import "async"
dotenv.config();

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
}).on('error', (error) => {
    console.log(error)
})
