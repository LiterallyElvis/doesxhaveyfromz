module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
  });

  app.get('/search', function(req, res, next) {
    res.render('results');
  });

  app.get('/results', function(req, res, next) {
    res.render('results');
  });

  app.get('/inquiry/:id', function(req, res){
    res.render('inquiry');
  })
}