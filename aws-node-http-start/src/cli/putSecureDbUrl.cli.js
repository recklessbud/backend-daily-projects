import { putSecureDbUrl } from "../utils/secureDbUrl.helper";

const args = process.argv.slice(2);

if(args.length !== 3){
    console.log('usage: tsx src/cli/putSecureDbUrl.cli.js <stage> <dburl> <directUrl>');
    process.exit(1)
}

async function main() {
    try {
        console.log("Updating Secret...");
        const [stage, dbUrl, directUrl] = args;
        
        const result = await putSecureDbUrl(stage, {
            databaseUrl: dbUrl,
            directUrl
        });
        
        if (!result) {
            throw new Error('Failed to set secret - no result returned');
        }
        
        console.log('Result:', result);
        console.log(`Secret successfully set for stage '${stage}'`);
        process.exit(0);
    } catch (error) {
        console.error('Error setting secret:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}