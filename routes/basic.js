module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
  });

  app.get('/search', function(req, res, next) {
    res.render('results');
  });

  app.get('/submit', function(req, res, next) {
    res.render('submit');
  });

  app.get('/unanswered', function(req, res, next) {
    res.render('unanswered');
  });

  app.get('/results', function(req, res, next) {
    res.render('results');
  });

  app.get('/inquiry/:id', function(req, res){
    res.render('inquiry');
  })
}