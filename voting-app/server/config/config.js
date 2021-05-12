import Joi from 'joi';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
const envFile = env === 'test'
  ? 'test.env'
  : (env === 'production' ? 'production.env' : '.env');

dotenv.config({ path: envFile });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  MONGO_URI: Joi.string().required().description('Mongo DB url')
}).unknown().required();

const {error, value: envVars} = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongoUri: envVars.MONGO_URI
};

export default config;
