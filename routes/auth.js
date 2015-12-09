var passport = require('passport')
var GitHubStrategy = require('passport-github2').Strategy;
var pg = require('pg');
var connUrl = process.env.POSTGRES_CONNECTION_URL

module.exports = function(app){
  // Use the GitHubStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and GitHub
  //   profile), and invoke a callback with a user object.
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        app.db.query('select * from users where github_access_token=$1', [accessToken], function(err, read_result){
          if(err){ console.log('error making query: ' + err); } else {
            if(read_result.rowCount === 0){
              app.db.query('insert into users (email, github_access_token, username, avatar_url, github_user_id, last_login, created_at) values ($1, $2, $3, $4, $5, $6, $6)',
                                              [profile.emails[0].value, accessToken, profile._json.login, profile._json.avatar_url, profile.id, 'NOW()'],
              function(err, write_result){
                if(err){ console.log('error inserting query: ' + err); }
                else { return done(null, profile); }
              });
            } else {
              app.db.query('update users set last_login=NOW() where id=$1', [read_result.rows[0].id],
                function(err, whatever){
                  if(err){ console.log('error updating login time: ' + err); }
                }
              );
              profile['github_id'] = profile['id'];
              profile['db_id'] = read_result.rows[0].id;
              return done(null, profile);
            }
          }
        });
      });
    }
  ));

  app.get('/auth/signin',
    passport.authenticate('github', { scope: [ 'user:email' ] }),
    function(req, res){}
  );

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  app.get('/auth/error',
    function(req, res) {
      res.send('TODO: Proper error messages');
    }
  );

  app.get('/auth/logged_in', function(req, res){
    if( req.user ){ res.status(200).json({user: req.user}); }
    else { res.status(200).json({user: null}); }
  });

  app.get('/auth/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}
