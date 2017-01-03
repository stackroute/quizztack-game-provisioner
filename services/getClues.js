const async = require('async');
const fetchQuestions = require('./fetchQuestions');

module.exports = function(callback) {
  var topics=["Sports","Music","Science","History","Politics","Movies"];
  const functionArray = topics.map(function(topic) {
    return fetchQuestions.bind(null, topic);
  });

  async.parallel(functionArray, function(err, results) {
    if(err) { /* TODO: Handle Error */console.log('ERR:',err); return; }
    callback(null, results);
  });
};
