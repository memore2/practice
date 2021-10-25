export const localmiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};

  next();
};

export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.status(400).redirect("/login");
  }
};

export const publicmiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.status(400).redirect("/");
  }
};
