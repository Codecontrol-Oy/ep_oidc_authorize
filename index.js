exports.authorize = function(hook_name, context, cb) {
  console.log("ep_oidc_authorize: Authorize in action");
  if(context.resource == "/auth/callback")
  {
      console.log("ep_oidc_authorize: Callback passed");
    return cb([true]);
  }
  if (context.req.session.passport) {

      try {
          var authorizeUrl = "http://10.0.1.12:9666/api/v1.0/pads/authorize?sub=username&url=anyurl";
          //var authorizeUrl = process.env.ETHERPAD_AUTH_URL;
          //var xmlHttp = new XMLHttpRequest();

          //if (typeof context != "undefined" && context.req.session.passport.sub != null)
          //    authorizeUrl += "?sub=" + context.req.session.passport.sub;
          //else
          //    authorizeUrl += "?sub=test";

          //if (typeof context != "undefined" && context != null && context.req.url != null)
          //    authorizeUrl += "&url=" + context.req.url;
          //else
          //    authorizeUrl += "&url=" + "testurl";

          var isAuthorized = false;

          $.ajax({
              url: 'http://10.0.1.12:9666/api/v1.0/pads/authorize?sub=test&url=testurl',
              type: 'GET',
              dataType: 'json',
              contentType: 'application/json; charset=utf-8',
              success: function (data, xhr) {
                  if (xhr.status == 200)
                      isAuthorized = true;
                  else
                      isAuthorized = false;
              }
          });

          return cb([isAuthorized);
          //xmlHttp.open("GET", authorizeUrl, false); // false for synchronous request
          //xmlHttp.send();
          //console.debug("ep_oidc_authorize: statuscode: " + xmlHttp.status);
          //
          //var resp = JSON.parse(xmlHttp.responseText);
          //if (xmlHttp.status = 200 && resp.hasRights == true) {
          //    console.debug("ep_oidc_authorize: Authorize success");
          //    return cb([true]);
          //}
          //else {
          //    console.debug("ep_oidc_authorize: Unauthorized");
          //    return cb([false]);
          //}
      } catch (e) {
          console.log("ep_oidc_authorize ERROR" + e.message);
          return cb([true]); //return true for debugging

      }
      
  } 
  else {
    console.log('ep_oidc_authorize: auth not completed');
    return cb([false]);
  }
};

