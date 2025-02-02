#!/usr/bin/env node
import axios from 'axios';

import { Command } from 'commander';


interface Activity {
    id: string;
    type: string;
    repo: {
        name: string;
    };
    created_at: string;
}


const fetchUser = async (username: string): Promise<Activity[]> => {

    try {
        const response = await axios.get(`https://api.github.com/users/${username}/events`)

        return response.data

    } catch (error) {

        console.log("error fetching user", error)

        process.exit(1);

    }
}



const main = async()=>{
   const program = new Command()
    
    program
    .version('1.0.0')

    .description('fetch github user events')

    .argument('<username>', 'Github username')

    .action( async (username) => {

        console.log('fetching user events', username)

        const activityData = await fetchUser(username)

        activityData.forEach((element: { created_at: string | number | Date; type: any; repo: { name: any; }; }) => {

            const createdAt = new Date(element.created_at)

            console.log(`${createdAt.toLocaleString()} : ${element.type} on ${element.repo.name}`)
        })

    })

   program.parse(process.argv)
}


main()