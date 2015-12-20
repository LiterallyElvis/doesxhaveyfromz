var async = require('async');

module.exports = function(app){
  var catchAlls = ['anything']

  app.get('/', function(req, res) {
    var pageData = {
      user: req.user,
      title: 'Does X have Y from Z?'
    }
    res.render('index', pageData);
  });

  app.get('/unanswered', function(req, res) {
    var pageData = {
      user: req.user,
      title: 'Does anything have something from anything else?'
    }

    app.inquiryFunctions.retrieveUnansweredInquiries(function(unanswereds){
      pageData.inquiries = unanswereds.data;
      pageData.unansweredsExist = unanswereds.data.length > 0;
      res.render('unanswered', pageData);
    });
  });

  app.get('/search', function(req, res) {
    var pageData = {
      user: req.user,
      inquiry: {
        x: req.query.x || catchAlls[0],
        y: req.query.y || catchAlls[0],
        z: req.query.z || catchAlls[0]
      },
      get title(){
        return 'Does ' + this.inquiry.x + ' have ' + this.inquiry.y + ' from ' + this.inquiry.z + '?';
      }
    }

    app.inquiryFunctions.searchForInquiry(req, function(results){
      pageData.inquiries = results.data;
      pageData.canSubmitInquiry = false;
      if( ( catchAlls.indexOf(pageData.inquiry.x.toLowerCase()) === -1 ) &&
          ( catchAlls.indexOf(pageData.inquiry.y.toLowerCase()) === -1 ) &&
          ( catchAlls.indexOf(pageData.inquiry.z.toLowerCase()) === -1 ) ){
        pageData.canSubmitInquiry = true;
      }
      res.render('search', pageData);
    });
  });

  app.get('/answer/:inquiry_id', function(req, res) {
    if( !req.user ){
      res.redirect('/');
    } else {
      var pageData = {
        user: req.user,
        inquiryId: req.params.inquiry_id
      }

      app.inquiryFunctions.retrieveInquiryData(req, function(inquiry){
        pageData.inquiry = inquiry.data;
        pageData.title = 'Answering if ' + pageData.inquiry.x + ' has ' + pageData.inquiry.y + ' from ' + pageData.inquiry.z;
        res.render('submit-answer', pageData);
      });
    }
  });

  app.get('/inquiry/:inquiry_id', function(req, res){
    var pageData = {
      user: req.user,
      inquiryId: req.params.inquiry_id
    }

    async.auto({
      inquiryData: function(callback, results){
        app.inquiryFunctions.retrieveInquiryData(req, function(inquiry){
          if( inquiry.status === 500 ){ callback(inquiry.data, null) }
          else { callback(null, inquiry.data) }
        });
      },
      answerData: function(callback, results){
        app.inquiryFunctions.retrieveAnswerForInquiryId(req, function(answers){
          answers.data.sort(function(x, y){
            if( x.upvotes > y.upvotes ){ return -1; }
            if( x.upvotes < y.upvotes ){ return  1; }
            return 0;
          });
          callback(null, answers.data);
        });
      },
      complete: ['inquiryData', 'answerData', function(callback, results){
        pageData.inquiry = results.inquiryData;
        pageData.answers = results.answerData;
        pageData.title = 'Does ' + pageData.inquiry.x + ' have ' + pageData.inquiry.y + ' from ' + pageData.inquiry.z + '?';
        res.render('inquiry', pageData);
      }]
    });
  });
}
