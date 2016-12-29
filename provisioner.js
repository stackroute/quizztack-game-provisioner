var redis = require('redis');
var gameInitializer = require('./initializingGame/initializeGame')
const redisUrl = process.env.REDIS_URL || "localhost";
const redisPort = process.env.REDIS_PORT || "6379";
var redisClient = redis.createClient(redisPort, process.env.REDIS_HOSTNAME);
var gameClient = redisClient.duplicate();
var playerList = [];

redisClient.on("error", (err) => {
  console.log('Error:',err);
});

redisClient.on("ready", () => {
  getMessage();
});

function getMessage() {
  console.log('Waiting for message');
  redisClient.brpop('queuedPlayer', 0, (err, reply) => {
    if(err) { process.exit(-1); }
    console.log('Message Received:',reply[1]);
    console.log('Start Processing:',reply[1]);
    playerList.push(reply[1]);
    console.log(playerList);
    if(playerList.length==3){
      //assign game id and redirect
      var gameId = Math.round(Math.random()*1000000);
      initializeGame(gameId,questions,users,playerScores)
      console.log("identified 3 players in provisioner");
      playerList.pop();
      playerList.pop();
      playerList.pop();
      console.log(playerList);


    }

    processMessage(reply[1], (err) => {
      if(err) { return redisClient.lpush('provisionerWorkQueue', reply[1]); }
      console.log('Processing Complete', reply[1]);
      setTimeout(getMessage);
    });
  });
}

function processMessage(message, callback) {
  console.log('Processing:', message);
  callback(null);
}
