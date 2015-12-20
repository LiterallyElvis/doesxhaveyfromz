module.exports = function(app){
  app.misc = {};

  // TODO: Finish this.
  app.misc.retrieveAutocomplete = function(res){
    app.db.query('select distinct x, y, z from inquiries', [], function(err, result){
      if( err ){ return res.status(500).json({ error: err }) }
      res.status(200).json(result.rows)
    });
  };
}