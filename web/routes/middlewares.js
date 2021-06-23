exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인이 필요합니다");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    //const message = encodeURIComponnent("로그인한 상태입니다.");
    //res.redirect(`/?error=${message}`);
    res.status(403).send("이미 로그인한 상태입니다");
  }
};
