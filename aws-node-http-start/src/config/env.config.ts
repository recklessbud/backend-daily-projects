//remember to add zod to validate env variables
import dotenv from 'dotenv';

dotenv.config();
const processENV = process.env;

const envVariables = {
    NODE_ENV: processENV.NODE_ENV || 'development',
}


export default envVariables