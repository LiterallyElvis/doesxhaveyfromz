module.exports = function(app){
  app.get('/', function(req, res) {
    var pageData = {
      user: req.user
    }
    res.render('index', pageData);
  });

  app.get('/unanswered', function(req, res) {
    var pageData = {
      user: req.user
    }
    res.render('unanswered', pageData);
  });

  app.get('/search', function(req, res) {
    var pageData = {
      user: req.user
    }
    res.render('search', pageData);
  });

  app.get('/answer/:id', function(req, res) {
    if( !req.user ){
      res.render('index');
    } else {
      var pageData = {
        user: req.user
      }
      res.render('submit-answer', pageData);
    }
  });

  app.get('/inquiry/:id', function(req, res){
    var pageData = {
      user: req.user
    }
    res.render('inquiry', pageData);
  })
}
