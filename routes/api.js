module.exports = function(app){
  app.get('/api/autocompletes', function(req, res, next) {
  	app.db.query('select distinct x, y, z from inquiries', [], function(err, result){
			if( err ){ return res.status(500).json({ error: err }) }
			res.status(200).json(result.rows)
  	});
	});

  // inquiries
  app.get('/api/search', function(req, res){
    // this whole route is clevergirl.gif
    var catchAll = 'anything';
    console.log('\n\n')
    if( Object.keys(req.query).length < 1 ){
      return res.status(500).json({error: 'no search parameters set!'});
    }

    var paramsToAdd = [];
    var queryString = 'select * from inquiries where ';
    var index = 1;

    for( var query in req.query ){
      if( req.query[query].toLowerCase() != catchAll && req.query[query].trim() != '' ){
        queryString += 'LOWER(' + query + ')=LOWER($' + index + ') and ' ;
        index += 1;
        paramsToAdd.push(req.query[query]);
      }
    }
    queryString = queryString.substr(0, queryString.lastIndexOf(' and '));

    // I feel super clever and also super bad?????
    app.db.query(queryString, paramsToAdd, function(err, result){
      if( err ){ return res.status(500).json({ error: err }) }
      return res.status(200).json(result.rows)
    });
  });

  app.get('/api/inquiry/:inquiry_id/answers', function(req, res){
    app.db.query('select * from inquiries, answers join users on answers.user = users.id where inquiry_id=1 and inquiries.id=$1', [req.params.inquiry_id], function(err, result){
      if( err ){ return res.status(500).json({ error: err }); }
      return res.status(200).json(result.rows)
    })
  });

  app.post('/api/create_inquiry', function(req, res){
    app.db.query('insert into inquiries () values ()', [], function(err, result){
      if( err ){ return res.status(500).json({ error: err }); }
    })
  });
}
