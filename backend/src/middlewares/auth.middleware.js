import jwt from "jsonwebtoken";
import config from "../config.js";

export default async function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Token not found",
    });
  }

  const [type, tokenWithoutBearer] = token.split(" ");

  if (!tokenWithoutBearer || type !== "Bearer") {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }

  try {
    jwt.verify(tokenWithoutBearer, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "invalid or expired token",
        });
      }

      req.user = decoded;

      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Authorization Error",
    });
  }
}
