var config = require('./config');
var restify = require('restify');
var api = require('./api/v1/api');
var h = require('./api/v1/helper');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function callAPI(req, res, next) {
  var funcName = req.params[0];
  var func = api[funcName];
  if(func === undefined) return next(new restify.NotFoundError('Invalid API call'));
  // TODO: consider adding authentication parameters to req.params here (taken from req.header for example)
  // TODO: sanitize the params before proceeding (no pun intended, but NoSQL Injection anyone?)
  try {
    func.call(api, req.params, function(err, result) {
      if(err) {
        console.log('API call to `' + funcName + '` error');
        console.log(err);
        err = mapErr(err);
        return res.json(err.code, { code: err.code, message: err.msg });
      }
      console.log('API call to `' + funcName + '` successful');
      console.log(result);
      var retCode = result.statusCode || 200;
      return res.json(retCode, { code: retCode, message: result });
    });
  } catch(err) {
    console.log('API call to `' + funcName + '` error');
    console.log(err);
    err = mapErr(err);
    return res.json(err.code, { code: err.code, message: err.msg });
  }
}

/*
 * returns a standardized error object with fields 'code' and 'msg'
 * so that it can be consumed consistently by callAPI()
 */
function mapErr(err) {
  var errCode = err.statusCode || 500;
  var errMsg = err;
  if(!h.isString(err) && 'body' in err)
    errMsg = err['body']; // return a single string or the body of restify.RestError instance
  return {
    code: errCode,
    msg: errMsg
  }
}

var server = restify.createServer({
  name: process.env.npm_package_name || 'Simple REST API Server',
  version: process.env.npm_package_version || '0.0.0'
});
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
server.get(/api\/(.*)/, callAPI); // note how we use a RegExp here, not a String like the above cases

server.listen(config.appport, function() {
  console.log('%s %s listening at %s', server.name, server.versions, server.url);
});
