var async = require('async');

module.exports = function(app){
  app.post('/api/submit_answer/:inquiry_id', function(req, res){
    if( req.body && req.user ){
      app.inquiryFunctions.submitInquiry(req, function(success){
        return res.status(success.status).json(success.data);
      })
    }
  });

  app.post('/api/vote/up/:answer_id', function(req, res){
    if( req.body && req.user ){
      app.voteFunctions.submitUpOrDownVote(req.params.answer_id, req.user.db_id, 'upvote', function(){
        res.status(200).json({});
      });
    } else {
      return res.status(404).json({ error: 'must be logged in to vote' });
    }
  });

  app.post('/api/vote/down/:answer_id', function(req, res){
    if( req.body && req.user ){
      app.voteFunctions.submitUpOrDownVote(req.params.answer_id, req.user.db_id, 'downvote', function(){
        res.status(200).json({});
      });
    } else {
      return res.status(404).json({ error: 'must be logged in to vote' });
    }
  });

  app.post('/api/vote/unproductive/:answer_id', function(req, res){
    if( req.body && req.user ){ app.voteFunctions.markSomethingAsUnproductive(req, res); }
  });

  app.post('/api/create_inquiry', function(req, res){
    if( req.user ){
      app.inquiryFunctions.createInquiry(req, function(success){
        return res.status(success.status).json(success.data);
      })
    } else {
      return res.status(500).json({ error: 'Must be logged in to submit a query' });
    }
  });
}
