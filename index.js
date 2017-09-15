var request = require('request');
var log4js = require('log4js');
//var pm = require('ep_etherpad-lite/node/db/PadManager');

log4js.configure({
    appenders: { authorize: { type: 'file', filename: 'ep_oidc_authorize.log' } },
    categories: { default: { appenders: ['authorize'], level: 'debug' } }
});

var logger = log4js.getLogger('authorize');

exports.authorize = function (hook_name, context, cb) {
    logger.debug('ep_oidc_authorize: Authorize in action');
    
  if(context.resource == "/auth/callback")
  {
      logger.debug('ep_oidc_authorize: Callback passed');
    return cb([true]);
  }
  if (context.req.session.passport) {

      //Only authorize ones starting with /p/ = public or g. = group
      if (!context.resource.startsWith("/p/") && !context.resource.startsWith("/g.")) {
          logger.debug("ep_oidc_authorize: Not interested authorizing resource:" + context.resource);
          return cb([true]);
      }

      try {
          var authorizeUrl = process.env.ETHERPAD_AUTH_URL;
          authorizeUrl += "?user_id=" + context.req.session.passport.user.sub;
          authorizeUrl += "&resource=" + context.resource;
          
          request.get({
              url: authorizeUrl,
              json: true
          }, function (err, res, data) {
              //Error
              if (err) {
                  logger.error("ep_oidc_authorize: Error calling Authorize: " + err);
                  return cb([false]);
              }

              //Success
              logger.debug("ep_oidc_authorize: Authorize returned " + res.statusCode + " " + res.statusMessage);

              if (res.statusCode == 200)
                  return cb([true]);
              else
              {
                  var body = "<h1>Unauthorized access.<h1>";
                  context.res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                  context.res.end(body);
                  //return cb([false]);
              }
                  
                  
          });

      } catch (e) {
          logger.error("ep_oidc_authorize: Error:" + e.message);
          return cb([false]); 
      }
  } 
  else {
    logger.debug('ep_oidc_authorize: auth not completed');
    return cb([false]);
  }
};

