module.exports = function(app) {
  var routes = {};
  require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.endsWith('.js') && file !== 'index.js') {
      var name = file.replace('.js', '')
      routes[name] = require('./' + name);
      routes[name](app);
    }
  });
}