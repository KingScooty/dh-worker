const Twit = require('twit');

// var config = app.locals.config.twitter;

var T = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

var stream = T.stream('statuses/filter', { track: ['#digitalheroes2015', '#halloweenheroes2015'] });

stream.on('tweet', function callback(tweet) {
  console.log('SOMEONE TWEETED!');
  // Change the type of the document for filtering.
  tweet.type = "tweet";

  // app.locals.db.dh_halloween15.save(tweet.id_str, tweet, function callback(err, res) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log('Tweet ' + tweet.id_str + ' saved to db');
  //   }
  // });
});
