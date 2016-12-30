var redis = require('redis');
var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOSTNAME);
const async = require('async');

function initializeGame(gameId,questions,users,playerScores, callback)
{

	async.parallel([

			(internalCallback) => {
				client.set(gameId+"_questions",JSON.stringify(questions),function(err,reply)
				{
					console.log('questions', questions);
					internalCallback(null);
				});
			}, (internalCallback) => {
				client.set("gameId",gameId,function(err,reply)
				{
					console.log("gameId", gameId);
					internalCallback(null);
				});
			}, (internalCallback) => {
				client.set("users",JSON.stringify(users),function(err,reply)
				{
					console.log("users", users);
					internalCallback(null);
				});
			}, (internalCallback) => {
				client.set("scores",JSON.stringify(playerScores),function(err,reply)
				{
					console.log("scores", playerScores);
					internalCallback(null);
				});
			}], function(error, results) {
				callback(null);
	});
}
module.exports = initializeGame;
