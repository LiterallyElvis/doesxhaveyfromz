var pg = require('pg');

var connUrl = process.env.POSTGRES_CONNECTION_URL

pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
});