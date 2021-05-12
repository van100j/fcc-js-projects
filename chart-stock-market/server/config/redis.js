import config from './config';
import redis from 'redis';
import bluebird from "bluebird";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(config.redisUrl, {
  db: config.env === 'test' ? 1 : 0
});

// redisClient.on('ready',function() { console.log("Redis is ready")});
// redisClient.on('error',function() { console.log("Error in Redis")});

export default redisClient;
