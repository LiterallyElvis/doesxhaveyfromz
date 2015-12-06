module.exports = function(app){
  app.get('/api/autocompletes', function(req, res, next) {
  	app.db.query('select distinct x, y, z from inquiries', [], function(err, result){
			if( err ){ return res.status(500).json({ error: err }) }
			res.status(200).json(result.rows)
  	});
	});

  app.get('/api/unanswered', function(req, res){
    var analyticsQuery = "insert into inquiry_history (x, y, z, time_performed, requested_unanswered) values ($1, $1, $1, $2, $3)";
    var analyticsParams = ['anything', 'NOW()', 'true'];

    app.db.query(analyticsQuery, analyticsParams, function(err, result){ if( err ){ console.log(err) }; });

    // I feel super clever and also super bad?????
    app.db.query('select * from inquiries where answer is null', [], function(err, result){
      if( err ){ console.log(err); return res.status(500).json({ error: err }) }
      return res.status(200).json(result.rows);
    });
  });

  app.get('/api/search', function(req, res){
    // this whole route is clever_girl.gif
    var catchAlls = ['anything'];
    var validParams = ['x', 'y', 'z'];
    if( Object.keys(req.query).length < 1 ){ return res.status(500).json({error: 'no search parameters set!'}); }

    var paramsToAdd = [];
    var searchQuery = 'select * from inquiries where ';
    var analyticsQuery = 'insert into inquiry_history (';
    var dataIndex = 1;

    for( var param in req.query ){
      if( catchAlls.indexOf(req.query[param].toLowerCase()) == -1 && req.query[param].trim() != '' && validParams.indexOf(param) > -1 ){
        searchQuery += 'LOWER(' + param + ')=LOWER($' + dataIndex + ') and ';
        analyticsQuery += param + ', ';
        dataIndex += 1;
        paramsToAdd.push(req.query[param]);
      }
    }

    // TODO: use async here?
    searchQuery = searchQuery.substr(0, searchQuery.lastIndexOf(' and '));

    // ugh, I'm unhappy with literally all of this mess.                        v---- that's kinda neat tho
    analyticsQuery = analyticsQuery.substr(0, analyticsQuery.lastIndexOf(', ')) + ', time_performed) values (';
    for( var i = 1; i <= paramsToAdd.length + 1; i++ ){ analyticsQuery += '$' + i + ', '; };
    analyticsQuery = analyticsQuery.substr(0, analyticsQuery.lastIndexOf(', ')) + ')';
    var analyticsParams = paramsToAdd.slice(0, paramsToAdd.length);
    analyticsParams.push('NOW()');

    app.db.query(analyticsQuery, analyticsParams, function(err, result){ if( err ){ console.log(err) }; });

    // I feel super clever and also super bad?????
    app.db.query(searchQuery, paramsToAdd, function(err, result){
      if( err ){ console.log(err); return res.status(500).json({ error: err }) }
      return res.status(200).json(result.rows);
    });
  });

  app.get('/api/inquiry/:inquiry_id/answers', function(req, res){
    app.db.query('select * from inquiries, answers join users on answers.user = users.id where inquiry_id=$1 and inquiries.id=$1', [req.params.inquiry_id], function(err, result){
      if( err ){ return res.status(500).json({ error: err }); }
      return res.status(200).json(result.rows);
    });
  });

  app.post('/api/submit_answer/', function(req, res){
    if( req.body && req.user ){
      app.db.query('insert into answers (user, inquiry_id, answer, summary, x_example, z_example, user) values ()', [req.body.x, req.body.y, req.body.z, req.user.id, 'NOW()'], function(err, result){
        if( err ){ return res.status(500).json({ error: err }); } else {
          return res.status(200).json({ success: 'yep' });
        }
      });
    }
  });

  app.post('/api/vote/unproductive/:answer_id', function(req, res){
    if( req.body && req.user ){
      app.db.query('update answers set votes_as_unproductive=votes_as_unproductive + 1 where id=$1', [req.params.answer_id], function(err, result){
        if( err ){ return res.status(500).json({ error: err }); } else {
          return res.status(200).json({ success: 'yep' });
        }
      });
    }
  });

  app.post('/api/create_inquiry', function(req, res){
    if( req.body && req.user && req.body.x && req.body.y && req.body.z ){
      var queryData = [req.body.x, req.body.y, req.body.z, req.user.id, 'NOW()'];
      console.log(queryData);
      app.db.query('insert into inquiries (x, y, z, asked_by, asked_at) values ($1, $2, $3, $4, $5)', [req.body.x, req.body.y, req.body.z, req.user.id, 'NOW()'], function(err, result){
        if( err ){ return res.status(500).json({ error: err }); } else {
          return res.status(200).json({ success: 'yep' });
        }
      });
    } else {
      return res.status(500).json({ error: 'Invalid parameters provided.'});
    }
  });
}
