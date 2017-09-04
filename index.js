var request = require('request');

exports.authorize = function (hook_name, context, cb) {
    console.debug("ep_oidc_authorize: Authorize in action");
    
  if(context.resource == "/auth/callback")
  {
      console.log("ep_oidc_authorize: Callback passed");
    return cb([true]);
  }
  if (context.req.session.passport) {

      try {
          //var authorizeUrl = "http://10.0.1.12:9666/api/v1.0/pads/authorize?sub=username&url=anyurl";
          var authorizeUrl = process.env.ETHERPAD_AUTH_URL;
          authorizeUrl += "?sub=" + context.req.session.passport.sub;
          authorizeUrl += "&url=" + context.resource;

          request.get({
              url: 'http://10.0.1.12:9666/api/v1.0/pads/authorize?sub=frompad&url=frompadtesturl',
              json: true
          }, function (err, res, data) {
              if (err) {
                  console.warn(data);
                  return cb([false]);
              }
              console.warn('ep_oidc_authorize result', data, typeof (data));
              if (res.statusCode == 200)
                  return cb([true]);
              else
                  return cb([false]);
          });

      } catch (e) {
          console.log("ep_oidc_authorize ERROR" + e.message);
          return cb([false]); 
      }
  } 
  else {
    console.log('ep_oidc_authorize: auth not completed');
    return cb([false]);
  }
};

