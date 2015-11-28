module.exports = function(app){
  app.get('/api/autocompletes', function(req, res, next) {
  	app.db.query('select distinct x, y, z from inquiries', [], function(err, result){
			if(err){ return res.status(500).json({ error: err }) }
			res.status(200).json(result.rows)
  	});
	});

  app.post('/api/create_inquiry', function(req, res){
    app.db.query('insert into inquiries () values ()', [], function(err, result){
      if(err){ return res.status(500).json({ error: err }); }
    })
  });
}