require("dotenv").config();
console.log(process.env.CUSTOM_AWS_ACCESS_KEY)
// console.log(process.env.AWS_SECRET_KEY)


module.exports = {
    aws:{
        accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY,
        secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY
    }
}