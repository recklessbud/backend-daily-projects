// dependencies
import app from './app';

//port environment variable
const PORT = process.env.PORT || 3000;


//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
.on('error', (error) => {
    console.log(error);
})