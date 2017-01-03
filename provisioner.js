var redisClient = require('./services/getRedisClient');
const async = require('async');
const getClues = require('./services/getClues');
const saveState = require('./services/saveState');

redisClient.on("error", (err) => {
  handleError(err);
});

redisClient.on("ready", () => {
  getMessage();
});

function getMessage() {
  console.log('Waiting for message');
  redisClient.brpop('provisionerInputQueue', 0, (err, reply) => {
    if(err) { console.log('ERR:',err); process.exit(-1); }
    console.log('Received Message: ', reply[1]);
    processMessage(reply[1], (err) => {
      if(err) { handleError(err); console.error('ERR:', err); return; }
      console.log('Processing Complete: ', reply[1]);
      setTimeout(getMessage);
    });
  });
}

function processMessage(player, callback) {
  queuePlayer(player, (err, noOfPlayersInQueue) => {
    if(err) { handleError(err); return; }
    if(noOfPlayersInQueue >= 3) { bootstrapGame(callback); return; }
    setTimeout(callback);
  });
}

function bootstrapGame(callback) {
  const gameId = 'game-' + Math.floor(100*Math.random());
  async.waterfall([
    getPlayerFromQueue.bind(null, []),
    getPlayerFromQueue,
    getPlayerFromQueue,
    initializeGame.bind(null, gameId),
    sendGameIdToPlayers.bind(null, gameId)
  ],(err, players) => {
    if(err) { handleError(err); reQueuePlayers(players, callback); return; }
    setTimeout(callback);
  });
}

function reQueuePlayers(players, callback) {
  async.each(players, reQueuePlayer, callback);
}

function reQueuePlayer(player, callback) {
  redisClient.rpush('playerQueue', player, callback);
}

function initializeGame(gameId, players, callback) {
  const scores = players.map((player) => {
    const score = { player: player, score: 0 };
    if(player === 'sagarpatke@gmail.com' || player === 'nischaygoyal@gmail.com') score.score = 100;
    return score;
  });

  getClues((err, questions) => {
    if(err) { callback(err); return; }
    const state = {
      scores: scores,
      questions: questions,
      cue: scores[0].player,
      currQuestion: false
    };
    saveState(gameId, state, (err) => {
      callback(err, players);
    });
  });
}

function sendGameIdToPlayers(gameId, players, callback) {
  console.log('Sending gameId', gameId, 'to players:', players);
  async.each(players,(player, callback1) => {
    redisClient.publish(player+'_gameId', gameId, callback1);
  }, callback);
}

function getPlayerFromQueue(players, callback) {
  redisClient.brpop('playerQueue', 1, (err, reply) => {
    if(err) { callback(err); }
    if(!reply) { callback(new Error("Timed Out"), players); }
    players.push(reply[1]);
    callback(null, players);
  });
}

function queuePlayer(playerId, callback) {
  redisClient.lrange('playerQueue', 0,-1,(err, reply) => {
    if(err) { callback(err); return; }
    const isPlayerAlreadyQueued = reply.indexOf(playerId);
    if(!isPlayerAlreadyQueued) { console.log('player ' + playerId + ' already exists in playerQueue', reply); callback(null, reply.length); }
    else { console.log('player ' + playerId + ' doesnt exist in playerQueue', reply); redisClient.lpush('playerQueue', playerId, callback); }
  });
}

function handleError(err) {
  console.error('ERR:', err);
  throw new Error(err);
}