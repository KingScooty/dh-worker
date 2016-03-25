const Twit = require('twit');
const db = require('db');
const nano = db.nano;
const database = db.database;

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var stream = T.stream('statuses/filter', {
  track: [
    '#digitalheroes2015',
    '#halloweenheroes2015'
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

  database.insert(tweet, tweet.id_str, function callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(`[LOG][2/2]: Tweet ${tweet.id_str} saved to database.`);
    }
  });
});
