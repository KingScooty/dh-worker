const Twit = require('twit');
const couchdb = require('./helpers/couchdb');
const first2014 = require('./init/ids-2014').first;
// const second2012 = require('./init/ids-2012').second;

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY || 'a',
  consumer_secret: process.env.CONSUMER_SECRET || 'b',
  access_token: process.env.ACCESS_TOKEN || 'c',
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || 'd'
});

const status = module.exports = T.get('statuses/lookup', {
    id: first2014.replace(/\s+/g, '')
  }, function(err, data, response) {
  console.log('STATUS:');
  console.log(data);

  var processedData = data.map(function(tweet, index) {
    tweet._id = tweet.id_str;
    tweet.type = 'tweet';
    return tweet;
  });

  var docs = {
    "docs": processedData
  };

  couchdb.bulk_insert_doc(docs, 'digitalheroes-2014', 0);

});
