module.exports = function(app){
  app.users = {};

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

  app.users.getUserInfo = function(userId, callback){
    var returnObj = {};
    var query = 'select username, avatar_url, github_user_id, created_at from users where id=$1';
    var queryParams = [userId];
    app.db.query(query, queryParams, function(err, results){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(results.rows[0]);
      callback(returnObj);
    })
  };

  app.users.getInquiriesByUser = function(userId, callback){
    var returnObj = {};
    var query = 'select * from inquiries where asked_by=$1';
    var queryParams = [userId];
    app.db.query(query, queryParams, function(err, results){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(results.rows);
      callback(returnObj);
    })
  };

  app.users.getAnswersByUser = function(userId, callback){
    var returnObj = {};
    var query = 'select summary, inquiry_id, answer, submitted_at, upvotes, downvotes, inquiries.x, inquiries.y, inquiries.z from answers join inquiries on answers.inquiry_id = inquiries.id where answered_by=$1';
    var queryParams = [userId];
    app.db.query(query, queryParams, function(err, results){
      returnObj = err ? logAndReturnError(err) : constructSuccessfulResult(results.rows);
      callback(returnObj);
    })
  };
}
