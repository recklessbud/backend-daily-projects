import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { getSecureDbUrl } from '../utils/secureDbUrl.helper';
import envVariables from './env.config';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

declare global {
  var prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | undefined;

async function getPrismaInstance() {
  if (prismaInstance) return prismaInstance;

  try {
    const urls = await getSecureDbUrl();
    if (!urls.databaseUrl || !urls.directUrl) {
        throw new Error('Database URL not found') 
    };

    const connectionString = envVariables.STAGE === "dev" ? urls.directUrl : urls.databaseUrl

    const pool = new Pool({ 
      connectionString,
      ssl: true 
    });
    
    const adapter = new PrismaNeon(pool);
    prismaInstance = new PrismaClient({ adapter });

    if (envVariables.STAGE === 'dev') {
      global.prisma = prismaInstance;
    }

    return prismaInstance;
  } catch (error) {
    console.error('Failed to initialize Prisma:', error);
    throw error;
  }
}

export default getPrismaInstance;