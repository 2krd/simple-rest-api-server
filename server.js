var config = require('./config');
var restify = require('restify');
var api = require('./api');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function callAPI(req, res, next) {
  var func = api[req.params.func];
  if(func === undefined) throw new Error('Invalid API call');
  func(req.params, function(err, result) {
    if(err) {
      res.json({ code: 500, message: err });
    } else {
      console.log('API call succeeded');
      console.log(result);
      res.json({ code: 200, message: result });
    }
  });
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get('/api/:func', callAPI);

server.listen(config.appport, function() {
  console.log('%s listening at %s', server.name, server.url);
});