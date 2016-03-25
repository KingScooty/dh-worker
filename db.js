const config = require('./config/');
const host =  config.database.host;

var nano = require('nano')(`http://${host}`);

/*
  http://couchdb-3c369e79-1.kingscooty.cont.tutum.io:5984/_all_dbs

  ["_replicator","_users","digitalheroes-2012","digitalheroes-2013","digitalheroes-2014","digitalheroes-2015","digitalheroes-halloween-2015"]

  May be worth querying what databases exist, and then mounting them instead of storing the object below??

  This way would allow for creation of new databases programatically when there's a new event. Would the worker create the new entry?

  The API should allow for the creation of databases from an end point, perhaps?

  Would have to be a secure endpoint.
*/

var database = nano.use('digitalheroes-halloween-2015');

module.exports.connection = nano;
module.exports.database = database;
