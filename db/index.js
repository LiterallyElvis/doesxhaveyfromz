var pg = require('pg');
var connUrl = process.env.POSTGRES_CONNECTION_URL

module.exports = function(app){
  pg.connect(connUrl, function(err, client, finished) {
    if(err){ console.log("DB Connection Error: couldn't connect to " + connUrl); }
    else {  app.db = client; }
  });
}
