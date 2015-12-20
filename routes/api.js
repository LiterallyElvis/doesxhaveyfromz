var async = require('async');

module.exports = function(app){
  // app.get('/api/autocompletes', function(req, res) {
  //   return res.status(200).json({ message: 'feature incomplete' });
  //   // app.tasks.retrieveAutocomplete(res);
  // });

  // app.get('/api/random_inquiry', function(req, res){
  //   app.inquiryFunctions.retrieveRandomInquiry(function(randomInquiry){
  //     return res.status(randomInquiry.status).json(randomInquiry.data);
  //   });
  // })

  // app.get('/api/unanswered', function(req, res){
  //   app.inquiryFunctions.retrieveUnansweredInquiries(function(unansweredInquiries){
  //     return res.status(unansweredInquiries.status).json(unansweredInquiries.data);
  //   });
  // });

  // app.get('/api/search', function(req, res){
  //   app.inquiryFunctions.searchForInquiry(req, function(searchResults){
  //     return res.status(searchResults.status).json(searchResults.data);
  //   });
  // });

  // app.get('/api/inquiry/:inquiry_id', function(req, res){
  //   app.inquiryFunctions.retrieveInquiryData(req, function(inquiryData){
  //     return res.status(inquiryData.status).json(inquiryData.data);
  //   });
  // });

  // app.get('/api/inquiry/:inquiry_id/answers', function(req, res){
  //   app.inquiryFunctions.retrieveAnswerForInquiryId(req, function(answers){
  //     return res.status(answers.status).json(answers.data);
  //   });
  // });

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
