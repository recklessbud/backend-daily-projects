import { SSMClient, GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm"
import envVariables from "../config/env.config"

const stage = envVariables.STAGE

// const ssmClient = new SSMClient({ region: 'us-east-1' })
interface DbUrls{
  databaseUrl: string
  directUrl: string
}


export async function getSecureDbUrl(){
  const DATABASE_URL_SSM_PARAM=`/serverless-demo/${stage}/database-url`
  const DIRECT_URL_SSM_PARAM=`/serverless-demo/${stage}/direct-url`   
  const client = new SSMClient({ region: 'us-east-1' });
  const paramStore = [
    new GetParameterCommand({
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true
  }),
   new GetParameterCommand({
    Name: DIRECT_URL_SSM_PARAM,
    WithDecryption: true
   })
]
  const results = await Promise.all(paramStore.map(command => client.send(command)));
  // const results = await client.send(command);
   return {
    databaseUrl: results[0].Parameter?.Value,
    directUrl: results[1].Parameter?.Value
  }
 }

 export async function putSecureDbUrl(stage: string, urls: DbUrls){
  const stages = stage ? stage: 'dev' 
  if(stages === "prod") {
    return
  }
  if(!urls.databaseUrl || !urls.directUrl){ 
    return
  }
  const DATABASE_URL_SSM_PARAM=`/serverless-demo/${stages}/database-url`
  const DIRECT_URL_SSM_PARAM=`/serverless-demo/${stages}/direct-url`   
  const SecureString = "SecureString" as any
  const client = new SSMClient({ region: 'us-east-1' });
  const paramStore = [
   new PutParameterCommand ({
    Name: DATABASE_URL_SSM_PARAM,
    Value: urls.databaseUrl,
    Type: SecureString,
    Overwrite: true
  }),
  new PutParameterCommand({
      Name: DIRECT_URL_SSM_PARAM,
      Value: urls.directUrl,
      Type: SecureString,
      Overwrite: true
    })
]

  // const command = new PutParameterCommand(paramStore);
  const results = await Promise.all(paramStore.map(command => client.send(command)));
  return results

}
