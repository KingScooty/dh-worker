const Twit = require('twit');
const insert_doc = require('helpers/couchdb/insert_doc');

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const stream = T.stream('statuses/filter', {
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

  insert_doc(tweet, tweet.id_str, 0)
  .then(function(response) {
    console.log(response);
    console.log(`[LOG][2/2]: Tweet ${tweet.id_str} saved to database.`);
  })
  .catch(function(error) {
    console.log(error);
  });
});
