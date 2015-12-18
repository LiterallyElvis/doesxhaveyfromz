module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
  });

  app.get('/unanswered', function(req, res, next) {
    res.render('unanswered', { user: req.user });
  });

  app.get('/search', function(req, res, next) {
    res.render('search', { user: req.user });
  });

  app.get('/answer/:id', function(req, res, next) {
    if( !req.user ){
      res.render('index', { user: req.user });
    } else {
      res.render('submit-answer', { user: req.user });
    }
  });

  app.get('/inquiry/:id', function(req, res){
    res.render('inquiry', { user: req.user });
  })
}
