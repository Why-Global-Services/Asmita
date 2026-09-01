const jwt = require("jsonwebtoken");
const config = require("../config/config");


// Generate Access Token
const generateAccessToken = async (paylaod) => {
  return jwt.sign(paylaod, config.Token.accessSecretKey, {
    expiresIn: `${config.Token.accessTokenExpiry}`,
  });
};

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.locals.errorMessage = "No token provided";
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "undefined" || token === "null") {
    res.locals.errorMessage = "No token provided";
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, config.Token.accessSecretKey, (err, decoded) => {
    if (err) {
      res.locals.errorMessage = "Invalid or expired token";
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Save user info (id, role, etc.) into req
    req.user = {
      _id: decoded._id || decoded.id,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  });
};
module.exports = {
  generateAccessToken,
  verifyAccessToken
};
