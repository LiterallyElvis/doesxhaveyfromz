var pg = require('pg');
var express = require('express');
var router = express.Router();

var connUrl = process.env.POSTGRES_CONNECTION_URL

router.get('/autocompletes', function(req, res, next) {
	pg.connect(connUrl, function(err, client, done) {
		client.query("select distinct x, y, z from inquiries", [], function(err, result){
			if(err){ return res.status(500).json({ error: err }) }
			res.status(200).json(result.rows)
		});
	});
});

module.exports = router;