var async = require('async');

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

  app.get('/api/inquiry/:inquiry_id', function(req, res){
    app.db.query('select * from inquiries join users on inquiries.asked_by = users.id where inquiries.id=$1', [req.params.inquiry_id], function(err, result){
      if( err ){ return res.status(500).json({ error: err }); }
      return res.status(200).json(result.rows);
    });
  });

  app.get('/api/inquiry/:inquiry_id/answers', function(req, res){
    app.db.query('select answers.id, summary, x_example, z_example, answer, submitted_at, upvotes, downvotes, username, avatar_url from answers join users on answers.answered_by = users.id where inquiry_id=$1', [req.params.inquiry_id],
      function(err, result){
        if( err ){ return res.status(500).json({ error: err }); }
        return res.status(200).json(result.rows);
      }
    );
  });

  app.post('/api/submit_answer/:inquiry_id', function(req, res){
    if( req.body && req.user ){
      app.db.query('insert into answers (answered_by, inquiry_id, answer, summary, x_example, z_example, submitted_at) values ($1, $2, $3, $4, $5, $6, $7)',
                   [req.user.db_id, req.params.inquiry_id, req.body.answer, req.body.summary, req.body.x_example, req.body.z_example, 'NOW()'], function(err, result){
        if( err ){ console.log(err); return res.status(500).json({ error: err }); } else {
          return res.status(200).json({ success: 'yep' });
        }
      });
    }
  });

  function submitUpOrDownVote(answerId, userId, direction, returnCallback){
    /*
      When a user sends a vote, we check to see if they have already voted for this answer
      If they have, and their vote is the same, we ignore it.
      If they haven't, and their vote is different, we change their vote.
    */
    async.auto({
      previousVote: function(callback){
        app.db.query('select * from answer_votes where answer_id=$1 and voting_user=$2', [answerId, userId],
          function(votedError, votedResult){
            if( votedError ){ callback(votedError, null) }
            else if( votedResult.rows.length != 0 ){ callback(null, votedResult.rows[0]) }
            else { callback(null, null) }
          }
        )
      },
      insertVote: ['previousVote', function(callback, results){
        if( results.previousVote == null ){
          app.db.query('insert into answer_votes (voting_user, quality, answer_id) values ($1, $2, $3)', [userId, direction, answerId],
            function(insertError, insertResults){
              if( insertError ){ callback(insertError, null) }
              else { callback(null, null) }
            }
          );
        } else {
          app.db.query('update answer_votes set quality=$1 where id=$2', [direction, results.previousVote.id],
            function(updateError, updateResults){
              if( updateError ){ callback(updateError, null) }
              else { callback(null, null) }
            }
          );
        }
      }],
      updateCounts: ['insertVote', function(callback, results){
        if( direction === 'downvote' ){
          app.db.query("update answers set upvotes=upvote_count.count, downvotes=downvote_count.count from (select count(*) as count from answer_votes where quality='upvote' and answer_id=$1 ) as upvote_count, (select count(*) as count from answer_votes where quality='downvote' and answer_id=$1 ) as downvote_count where id=$1", [answerId],
            function(countError, countResult){
              if( countError ){ console.log('error updatingCounts: ' + countError); callback(countError, null) }
              else { callback(null, null) }
            }
          );
        }
      }]
    }, returnCallback)
  }

  app.post('/api/vote/up/:answer_id', function(req, res){
    if( req.body && req.user ){
      submitUpOrDownVote(req.params.answer_id, req.user.db_id, 'upvote', function(){
        res.status(200).json({});
      });
    } else {
      return res.status(404).json({ error: 'must be logged in to vote' });
    }
  });

  app.post('/api/vote/down/:answer_id', function(req, res){
    if( req.body && req.user ){
      submitUpOrDownVote(req.params.answer_id, req.user.db_id, 'downvote', function(){
        res.status(200).json({});
      });
    } else {
      return res.status(404).json({ error: 'must be logged in to vote' });
    }
  });

  app.post('/api/vote/unproductive/:answer_id', function(req, res){
    if( req.body && req.user ){
      app.db.query('insert into answer_votes (voting_user, inappropriate, answer_id) values ($1, $2, $3)', [req.user.db_id, true, req.params.answer_id],
        function(err, r){
          if(err){ console.log('error reporting unproductive comment: ' + err) }
        }
      )
      app.db.query('update answers set votes_as_unproductive=votes_as_unproductive + 1 where id=$1', [req.params.answer_id], function(err, result){
        if( err ){ console.log('error reporting: ' + err); return res.status(500).json({ error: err }); } else {
          return res.status(200).json({ success: 'yep' });
        }
      });
    }
  });

  app.post('/api/create_inquiry', function(req, res){
    if( req.body && req.user && req.body.x && req.body.y && req.body.z ){
      var queryData = [req.body.x, req.body.y, req.body.z, req.user.db_id, 'NOW()'];
      console.log(queryData);
      app.db.query('insert into inquiries (x, y, z, asked_by, asked_at) values ($1, $2, $3, $4, $5)', [req.body.x, req.body.y, req.body.z, req.user.db_id, 'NOW()'], function(err, result){
        if( err ){ return res.status(500).json({ error: err }); } else {
          return res.status(200).json({ success: 'yep' });
        }
      });
    } else {
      return res.status(500).json({ error: 'Invalid parameters provided.'});
    }
  });
}
