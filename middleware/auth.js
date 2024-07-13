import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected routes token based

export const requireSingIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      message: "Error in requireSignIn MiddleWare",
      error,
    });
  }
};

// admin access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: true,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      message: "Error in isAdmin MiddleWare",
      error,
    });
  }
};
