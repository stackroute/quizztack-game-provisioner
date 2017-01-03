const client = require('./getRedisClient');
const async = require('async');

module.exports = function(gameId, state, callback) {
  async.parallel([
    saveQuestions.bind(null, gameId, state.questions),
    saveScores.bind(null, gameId, state.scores),
    saveCurrQuestion.bind(null, gameId, state.currQuestion),
    saveCue.bind(null, gameId, state.cue)
  ], callback);
};

function saveQuestions(gameId, question, callback) {
  client.set(gameId+'_questions', JSON.stringify(question), callback);
}

function saveScores(gameId, scores, callback) {
  client.set(gameId+'_scores', JSON.stringify(scores), callback);
}

function saveCurrQuestion(gameId, currQuestion, callback) {
  client.set(gameId+'_currQuestion', JSON.stringify(currQuestion), callback);
}

function saveCue(gameId, cue, callback) {
  client.set(gameId+'_cue', JSON.stringify(cue), callback);
}