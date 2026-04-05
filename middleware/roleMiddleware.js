// middleware/roleMiddleware.js
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("User: ",req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};

module.exports = authorize;