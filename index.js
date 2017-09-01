exports.authorize = function(hook_name, context, cb) {
  console.log("ep_oidc_authorize: Authorize in action");
  if(context.resource == "/auth/callback")
  {
      console.log("ep_oidc_authorize: Callback passed");
    return cb([true]);
  }
  if (context.req.session.passport) {

      try {
          var authorizeUrl = process.env.ETHERPAD_AUTH_URL;
          var xmlHttp = new XMLHttpRequest();
          var data = new FormData();
          data.append('sub', context.req.session.passport.sub);
          data.append('url', context.req.url);

          xmlHttp.open("GET", authorizeUrl, false); // false for synchronous request
          xmlHttp.send(data);
          console.debug("ep_oidc_authorize: responseText: " + xmlHttp.responseText);

          var resp = JSON.parse(xmlHttp.responseText);
          if (resp.hasRights == true) {
              console.debug("ep_oidc_authorize: Authorize success");
              return cb([true]);
          }
          else {
              console.debug("ep_oidc_authorize: Unauthorized");
              return cb([false]);
          }
      } catch (e) {
          console.log("ep_oidc_authorize ERROR: " + e.message);
          return cb([true]); //return true for debugging

      }
      
  } 
  else {
    console.log('ep_oidc_authorize: auth not completed');
    return cb([false]);
  }
};

