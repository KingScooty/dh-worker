const Twit = require('twit');
const couchdb = require('./helpers/couchdb');

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY || 'a',
  consumer_secret: process.env.CONSUMER_SECRET || 'b',
  access_token: process.env.ACCESS_TOKEN || 'c',
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || 'd'
});

const stream = module.exports = T.stream('statuses/filter', {
  track: [
    '#digitalheroes2016',
    '#digital-heroes2016',
    '#digitalheroes'
  ]
});

stream.on('tweet', function callback(tweet) {
  console.log(`[LOG][1/2]: Tweet received at ${(new Date).toISOString()}`);
  /*
   * Set type field for the doc, to enable it to be queried by the couchdb view
   */
  tweet.type = "tweet";

  /*
   * Trigger a save on the API[?]
   */

  couchdb.insert_doc(tweet, tweet.id_str, 0)
  .then(function(response) {
    console.log(`[LOG][2/2]: Tweet ${tweet.id_str} saved to database.`);
  })
  .catch(function(error) {
    console.log(error);
  });
});
