var redis = require('redis');
const redisHost = process.env.REDIS_HOST || '172.23.238.251';
const redisPort = process.env.REDIS_PORT || 6379;
const async = require('async');

function initializeGame(gameId,questions,playerScores, callback)
{
	var client = redis.createClient(redisPort, redisHost);
	async.parallel([
		(internalCallback) => {
			client.set(gameId+"_questions",JSON.stringify(questions),function(err,reply)
			{
				console.log('questions', questions);
				internalCallback(null);
			});
		}, (internalCallback) => {
			client.set(gameId+"_scores",JSON.stringify(playerScores),function(err,reply)
			{
				console.log("scores", playerScores);
				internalCallback(null);
			});
		}], function(error, results) {
			client.quit();
			callback(null);
	});
}
module.exports = initializeGame;
