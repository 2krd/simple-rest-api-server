var config = require('../../config');
var r = require('rethinkdb');
var aws = require('../../aws');

this.testFunction = function(params, cb) {
  return cb(null, 'This is a function, it returns a String');
};

this.testErrorFunction = function(params, cb) {
  return cb('This function returns an error!');
};

this.testAWS = function(params, cb) {
  aws.testBucket(params, cb);
};

/*
 * This is taken directly from the RethinkDB driver example
 * with a minor modification to employ the use of callback,
 * i.e: on success or error, it will invoke a callback appropriately
 */
this.testDb = function(params, cb) {
  r.connect({ host: config.dbhost, port: config.dbport }, function(err, conn) {
    if(err) return cb(err);
    r.db('test').tableCreate('tv_shows').run(conn, function(err, res) {
      if(err) return cb(err);
      r.table('tv_shows').insert({ name: 'Star Trek TNG' }).run(conn, function(err, res)
      {
        conn.close();
        if(err) return cb(err);
        cb.call(null, null, res); // or just cb(null, res);
      });
    });
  });
};
