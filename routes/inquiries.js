module.exports = function(app){
  app.inquiryFunctions = {};

  var logAndReturnError = function(err){
    console.log(err);
    return {
      status: 500,
      data: { error: err }
    };
  }

  var constructSuccessfulResult = function(result){
    return {
      status: 200,
      data: result
    };
  }

  app.inquiryFunctions.retrieveRandomInquiry = function(callback){
    var returnObj = {}
    app.db.query('select * from inquiries offset random() * (select count(*) from inquiries) limit 1', [], function(err, result){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(result.rows[0]);
      callback(returnObj);
    });
  };

  app.inquiryFunctions.retrieveUnansweredInquiries = function(callback){
    var returnObj = {};

    var analyticsQuery = "insert into inquiry_history (x, y, z, time_performed, requested_unanswered) values ($1, $1, $1, $2, $3)";
    var analyticsParams = ['anything', 'NOW()', 'true'];
    app.db.query(analyticsQuery, analyticsParams, function(err, result){ if( err ){ console.log(err) }; });

    app.db.query('select * from inquiries i where i.id not in (select inquiry_id from answers)', [], function(err, result){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(result.rows);
      callback(returnObj);
    });
  };

  app.inquiryFunctions.searchForInquiry = function(req, callback){
    var returnObj = {};

    if( Object.keys(req.query).length < 1 ){
      returnObj = logAndReturnError('no search parameters set');
      callback(returnObj);
    }

    // this whole thing feels like clever_girl.gif
    var catchAlls = ['anything'];
    var validParams = ['x', 'y', 'z'];
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

    searchQuery = searchQuery.substr(0, searchQuery.lastIndexOf(' and '));

    // ugh, I'm unhappy with literally all of this mess.                        v---- that's kinda neat though
    analyticsQuery = analyticsQuery.substr(0, analyticsQuery.lastIndexOf(', ')) + ', time_performed) values (';
    for( var i = 1; i <= paramsToAdd.length + 1; i++ ){ analyticsQuery += '$' + i + ', '; };
    analyticsQuery = analyticsQuery.substr(0, analyticsQuery.lastIndexOf(', ')) + ')';
    var analyticsParams = paramsToAdd.slice(0, paramsToAdd.length);
    analyticsParams.push('NOW()');
    // Let the record show that I feel both clever and bad about all of the above.

    // TODO: use async.parallel here, maybe?
    app.db.query(analyticsQuery, analyticsParams, function(err, result){ if( err ){ console.log(err) }; });
    app.db.query(searchQuery, paramsToAdd, function(err, result){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(result.rows);
      callback(returnObj);
    });
  };

  app.inquiryFunctions.retrieveInquiryData = function(req, callback){
    var returnObj = {};
    var queryString = 'select * from inquiries join users on inquiries.asked_by = users.id where inquiries.id=$1';
    var queryParams = [req.params.inquiry_id];
    app.db.query(queryString, queryParams,
      function(err, result){
        returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(result.rows[0]);
        callback(returnObj);
      }
    );
  };

  app.inquiryFunctions.retrieveAnswerForInquiryId = function(req, callback){
    var returnObj = {};
    var queryString = 'select answers.id, summary, x_example, z_example, answer, submitted_at, upvotes, downvotes, username, avatar_url from answers join users on answers.answered_by = users.id where inquiry_id=$1';
    var queryParams = [req.params.inquiry_id];
    app.db.query(queryString, queryParams, function(err, result){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(result.rows);
      callback(returnObj);
    });
  };

  app.inquiryFunctions.submitInquiry = function(req, callback){
    var returnObj = {};
    var submissionQuery = 'insert into answers (answered_by, inquiry_id, answer, summary, x_example, z_example, submitted_at) values ($1, $2, $3, $4, $5, $6, $7)'
    var submissionParams = [req.user.db_id, req.params.inquiry_id, req.body.answer, req.body.summary, req.body.x_example, req.body.z_example, 'NOW()']
    app.db.query(submissionQuery, submissionParams, function(err, result){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult({ success: true });
      callback(returnObj);
    });
  };

  app.inquiryFunctions.createInquiry = function(req, callback){
    var returnObj = {};
    if( req.body.x && req.body.y && req.body.z ){
      var query = 'insert into inquiries (x, y, z, asked_by, asked_at) values ($1, $2, $3, $4, $5) returning id';
      var queryData = [req.body.x, req.body.y, req.body.z, req.user.db_id, 'NOW()'];
      app.db.query(query, queryData, function(err, result){
        returnObj = err ? logAndReturnError(err) : constructSuccessfulResult({ post_id: result.rows[0].id });
        callback(returnObj);
      });
    } else {
      returnObj = logAndReturnError('Invalid parameters provided.');
      callback(returnObj);
    }
  }

}
