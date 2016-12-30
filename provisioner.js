var redis = require('redis');
var gameInitializer = require('./initializingGame/initializeGame')
const redisUrl = process.env.REDIS_URL || "localhost";
const redisPort = process.env.REDIS_PORT || "6379";
var redisClient = redis.createClient(redisPort, process.env.REDIS_HOSTNAME);
var gameClient = redis.createClient(redisPort, process.env.REDIS_HOSTNAME);
console.log('redisUrl:', redisUrl);
console.log('redisPort:', redisPort);
const async = require('async');
// var playerList = [];

redisClient.on("error", (err) => {
  console.log('Error:',err);
});

redisClient.on("ready", () => {
  getMessage();
});

function getMessage() {
  console.log('Waiting for message');
  redisClient.brpop('provisionerInputQueue', 0, (err, reply) => {
    if(err) { console.log('ERR:',err); process.exit(-1); }
    console.log('Received Message');
    processMessage(reply[1], (err) => {
      if(err) { return redisClient.lpush('provisionerWorkQueue', reply[1]); }
      console.log('Processing Complete', reply[1]);
      setTimeout(getMessage);
    });
  });
}

function getUserFromQueue (gameId, internalCallback) {
  gameClient.brpop('provisionerWorkQueue',0, (err2, reply2) => {
    console.log(reply2);
    let userData = JSON.parse(reply2[1]);
    redisClient.publish(userData.email+"_gameId",gameId, (err) => {
      if(err) { console.log('ERR:', err); return; }
      internalCallback(null, userData);
    });
  });
};

function processMessage(message, callback) {
  console.log('Message Received:', message);
  console.log('Processing:', message);
  console.log('Message Received:',message);
  redisClient.lpush('provisionerWorkQueue',message, function(err1, reply1) {
    console.log('players in queued Player', reply1);
    let playerScores = [0, 0, 0];
    let questions = "question Start spreading the news, I’m leaving today” are the opening lines of which song?";
    let userinfo=[];
      if(reply1 >= 3) {
          //assign game id and redirect
          var gameId = Math.round(Math.random()*1000000);
          async.waterfall([
            (internalCallback) => {
              getUserFromQueue(gameId, internalCallback);
            }, (userData, internalCallback) => {
              userinfo.push(userData);
              getUserFromQueue(gameId, internalCallback);
            }, (userData, internalCallback) => {
              userinfo.push(userData);
              getUserFromQueue(gameId, internalCallback);
            },(userData, internalCallback) => {
              userinfo.push(userData);
              internalCallback(null);
            }, (internalCallback) => {
              gameInitializer(gameId, questions, userinfo, playerScores, internalCallback);
            }
           ], function(error, results) {
             console.log("async series finished");
             callback(null);
          });
      }
      else {
        callback(null);
      }
  });
}
