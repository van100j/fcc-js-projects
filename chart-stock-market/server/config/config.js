import Joi from 'joi';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
const envFile = env === 'test' ? 'test.env' : (env === 'production' ? 'production.env' : '.env');

dotenv.config({ path: envFile });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(4040),
  QUANDL_API_URL: Joi.string().required().description('Quanfdl API URL required'),
  QUANDL_API_KEY: Joi.string().required().description('Quanfdl API key required'),
  REDIS_URL: Joi.string().required().description('Redis url')
}).unknown().required();

const {error, value: envVars} = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  quandlApiUrl: envVars.QUANDL_API_URL,
  quandlApiKey: envVars.QUANDL_API_KEY,
  redisUrl: envVars.REDIS_URL
};

export default config;
