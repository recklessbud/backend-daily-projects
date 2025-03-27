//remember to add zod to validate env variables
import dotenv from 'dotenv';

dotenv.config();
const processENV = process.env;

const envVariables = {
    STAGE: processENV.STAGE || 'prod', 
}


export default envVariables