exports.authorize = function(hook_name, context, cb) {
  console.debug("ep_oidc_authorize: Authorize in action");
  if(context.resource == "/auth/callback")
  {
      console.debug("ep_oidc_authorize: Callback passed");
    return cb([true]);
  }
  if (context.req.session.passport) {
      var hasRights = httpGet(req.session.passport.sub, context.req.url);
      console.debug("ep_oidc_authorize: Authorize success");
      //return cb([true]);
      return cb([hasRights]);
  } 
  else {
    console.debug('ep_oidc_authorize: auth not completed');
    return cb([false]);
  }
};


authorizeMe = function httpGet(sub, url) {
    var authorizeUrl = process.env.ETHERPAD_AUTH_URL;
    var xmlHttp = new XMLHttpRequest();
    var data = new FormData();
    data.append('sub', sub);
    if(url == null)
        data.append('url', "gotourl");
    else
        data.append('url', url);

    xmlHttp.open("GET", authorizeUrl, false); // false for synchronous request
    xmlHttp.send(data);
    console.debug("ep_oidc_authorize: httpGet: responseText: " + xmlHttp.responseText);

    var resp = JSON.parse(xmlHttp.responseText);
    if (resp.hasRights == true)
        return true;
    else
        return false;
}