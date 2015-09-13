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
  func.call(api, req.params, function(err, result) {
    if(err) {
      res.json({ code: 500, message: err });
    } else {
      console.log('API call succeeded');
      console.log(result);
      res.json({ code: 200, message: result });
    }
  });
}

server.use(restify.CORS()); // consider disabling this on production
server.use(restify.queryParser()); // note the order matters (queryParser, then bodyParser)
server.use(restify.bodyParser());
function corsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', '*'); // can tweak to specific HTTP Verbs if needed
  // these are referenced from https://github.com/restify/node-restify/issues/296#issuecomment-12333568
  // and left here just for reference purposes
  //res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
  //res.setHeader('Access-Control-Max-Age', '1000');
  return next();
}
function optionsRoute(req, res, next) {
  res.send(200); // let's be easy here and make way for OPTIONS requests to go through
  return next();
}
server.opts('/\.*/', corsHandler, optionsRoute);
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get('/api/:func', callAPI);

server.listen(config.appport, function() {
  console.log('%s listening at %s', server.name, server.url);
});
