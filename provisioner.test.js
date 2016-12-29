const redis = require('redis');
const redisUrl = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

console.log('redisHost:', redisUrl);
console.log('redisPort:', redisPort);

const redisClient = redis.createClient(redisPort, redisUrl);

redisClient.brpop('inputPlayer', 0, (err, reply) => {
  if(err) { console.log('ERR:', err); return; }
  console.log('reply:', reply);
  redisClient.quit();
});
