import { response } from "express";
import { isProductionEnvironment, jwtSecret } from "../config/config.js";
import jwt from "jsonwebtoken";

const errorResponse = (res = response, error) => {
  if (error.hasOwnProperty("code") || error.hasOwnProperty("errors")) {
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        errors: Object.keys(error.keyValue).map((field) => ({
          message: `The ${field} ${error.keyValue[field]} is already in use`,
          field,
        })),
      });
    }

    return res.status(400).json({
      ok: false,
      errors: Object.values(error.errors).map(({ message, path: field }) => ({
        message,
        field,
      })),
    });
  }

  return res.status(500).json({
    ok: false,
    errors: [{ message: error.message || error }],
  });
};

const authResponse = async (res = response, status, ok, message, data) => {
  const { payload, token } = data;
  let exp
  try {
     exp  = jwt.verify(token, jwtSecret).exp;
  } catch (error) {
    return errorResponse(res, error);
  }

  return res
    .status(status)
    .cookie("token", token, {
      httpOnly: true,
      secure: isProductionEnvironment,
      sameSite: "none",
      expires: new Date(exp * 1000),
    })
    .json({ ok, message, ...payload });
};

const successfulResponse = (
  res = response,
  status,
  ok,
  message,
  data = null
) => {
  return data
    ? res.status(status).json({
        ok,
        message,
        data,
      })
    : res.status(status).json({
        ok,
        message,
      });
};

export { errorResponse, authResponse, successfulResponse };
