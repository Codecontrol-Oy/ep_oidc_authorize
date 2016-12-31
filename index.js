

exports.authorize = function(hook_name, context, cb) {
  console.debug("ep_oidc_authorize: Authorize in action");
  if(context.resource == "/auth/callback")
  {
      console.debug("ep_oidc_authorize: Callback passed");
    return cb([true]);
  }
  if (context.req.session.passport) {
        console.debug("ep_oidc_authorize: Authorize success");
    return cb([true]);
  } 
  else {
    console.debug('ep_oidc_authorize: auth not completed');
    return cb([false]);
  }
};