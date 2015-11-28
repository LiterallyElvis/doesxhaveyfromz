module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
  });

  app.get('/results', function(req, res, next) {
    res.render('results');
  });
}