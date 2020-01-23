function checkAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

function checkAuthenticated403(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.sendStatus(403);
  }
}

function checkAdmin(req, res, next){
  if (req.user.isAdmin){
    return next();
  } else {
    res.redirect("/");
  }
}

function checkGuest(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/groups');
  }
}

module.exports =  {
  checkAuthenticated,
  checkAuthenticated403,
  checkGuest,
  checkAdmin
}
