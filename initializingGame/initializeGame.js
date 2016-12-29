var redis = require('redis');
var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOSTNAME);


function initializeGame(gameId,questions,users,playerScores)
{
	client.set(gameId+"_questions",JSON.stringify(questions),function(err,reply)
	{
		console.log('questions');
		console.log(reply);
	});


	client.set("gameId",gameId,function(err,reply)
	{
		console.log(gameId);
		console.log(reply);
	});

	client.set("users",JSON.stringify(users),function(err,reply)
	{
		console.log('hehhehhe');
		console.log(reply);
	});

	client.set("scores",JSON.stringify(playerScores),function(err,reply)
	{
		console.log('scores');
		console.log(reply);
	});
}
module.exports = initializeGame;
