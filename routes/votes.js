var async = require('async');

module.exports = function(app){
  app.voteFunctions = {};

  app.voteFunctions.submitUpOrDownVote = function(answerId, userId, direction, returnCallback){
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
  };

  app.voteFunctions.markSomethingAsUnproductive = function(req, res){
    app.db.query('insert into answer_votes (voting_user, inappropriate, answer_id) values ($1, $2, $3)', [req.user.db_id, true, req.params.answer_id],
      function(err, r){ if(err){ console.log('error reporting unproductive comment: ' + err) } }
    );
    app.db.query('update answers set votes_as_unproductive=votes_as_unproductive + 1 where id=$1', [req.params.answer_id], function(err, result){
      if( err ){ console.log('error reporting: ' + err); return res.status(500).json({ error: err }); } else {
        return res.status(200).json({ success: 'yep' });
      }
    });
  }

}