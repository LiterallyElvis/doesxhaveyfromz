var pg = require('pg');

var connUrl = process.env.POSTGRES_CONNECTION_URL

module.exports = function(app){
  app.get('/autocompletes', function(req, res, next) {
  	pg.connect(connUrl, function(err, client, done) {
  		if(err){
  			console.log("DB Connection Error: couldn't connect to " + connUrl);
  		} else {
  			client.query("select distinct x, y, z from inquiries", [], function(err, result){
  				if(err){ return res.status(500).json({ error: err }) }
  				res.status(200).json(result.rows)
  			});
  		}
  	});
  });
}