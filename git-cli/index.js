#!/usr/bin/env node

const axios = require('axios');
const { program }  = require('commander')

const fetchUser = async (username) =>{
 try {
    const response  = await axios.get(`https://api.github.com/users/${username}/events`)
    return response.data
 } catch (error) {
    console.log("error fetching user", error)
    process.exit(1);
 }
}

const main =  async ()=>{
    program
    .version('1.0.0')
    .description("fetch github user events")
    .argument('<username>', "Github username")
    .action( async (username) => {
        console.log('fetching user events', username)
        const activityData = await fetchUser(username)
        activityData.forEach(element => {
            const createdAt = new Date(element.created_at)
            console.log(`${createdAt.toLocaleString()} : ${element.repo.name} in ${element.type}`)
        });
    })
    program.parse(process.argv)
}


main()