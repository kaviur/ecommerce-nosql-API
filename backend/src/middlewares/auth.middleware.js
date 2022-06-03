import jwt from "jsonwebtoken";
import { request, response } from "express";
import { errorResponse } from "../helpers/responses.helper.js";
import { jwtSecret } from "../config/config.js";

const validateRol = (...roles) => {
  return (req = request, res = response, next) => {
    const { role } = req.payload;
    if (!roles.includes(role))
      return errorResponse(res, { message: "Insufficient permissions" }, 401);
    next();
  };
};

const verifyToken = (req = request, res = response, next) => {
  const token = req.cookies.token || null;
  if (!token)
    return errorResponse(res, { message: "The token is necessary" }, 403);

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.payload = payload;
  } catch (error) {
    return errorResponse(res, error);
  }
  next()
};

export { validateRol, verifyToken };
