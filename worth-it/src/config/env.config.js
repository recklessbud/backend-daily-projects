require("dotenv").config();
console.log(process.env.CUSTOM_AWS_ACCESS_KEY)
// console.log(process.env.AWS_SECRET_KEY)

const processEnv = process.env

module.exports = {
    aws:{
        accessKeyId: processEnv.CUSTOM_AWS_ACCESS_KEY,
        secretAccessKey: processEnv.CUSTOM_AWS_SECRET_KEY
    },
    NODE_ENV: processEnv.NODE_ENV,
    CHROME_PATH: processEnv.CHROME_PATH
}