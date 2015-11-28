module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/signin', function(req, res, next) {
    res.render('signin');
  });

  app.get('/results', function(req, res, next) {
    res.render('results');
  });
}
