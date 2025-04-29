import dotenv from 'dotenv';
dotenv.config();

const envVariables = {
  STAGE: process.env.STAGE || 'prod',
  IS_OFFLINE: process.env.IS_OFFLINE || 'false',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  ELASTICACHE_REDIS_URL: process.env.ELASTICACHE_REDIS_URL || '' as string,
  USE_TLS: process.env.USE_TLS || 'true',
};

export default envVariables;
