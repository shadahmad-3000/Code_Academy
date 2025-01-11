import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  // Check if a token was provided in the Authorization header
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or incorrectly formatted authorization token." });
  }

  // Extract token from string "Bearer [token]"
  const tokenValue = token.split(" ")[1];

  try {
    // Verify the token and get the payload (includes the user id)
    const decoded = jwt.verify(tokenValue, TOKEN_SECRET);

    // Search for the user in the Admin collection
    let userFound = await User.findById(decoded.id);

    // If the user is not in either collection, return an error
    if (!userFound) {
      return res.status(401).json({ message: "User not found." });
    }

    // Assign the user to req.user so that it is available in the following routes
    req.user = userFound;
    
    // Move to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "You are not authorized to perform this action. Please log in again." });
  }
};

export const isStellar = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "stellar") {
        next();
        return;
      }
    }
    return res.status(403).json({ message: "Require Stellar Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export const isGalactic = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "galactic") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "Require Galactic Role!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
