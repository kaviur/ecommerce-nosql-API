import { response } from "express";
import { isProductionEnvironment } from "../config/config.js";

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

  return res
    .status(500)
    .json({
      ok: false,
      status: 500,
      errors: [{ message: error.message || error
       }],
    });
};

const authResponse = (res = response, status, ok, message, data) => {
  const { payload, token } = data;

  return res
    .status(status)
    .cookie("token", token, {
      httpOnly: true,
      secure: isProductionEnvironment,
      sameSite: "none",
      expires: new Date(new Date().setDate(new Date().getDate() + 15)),
    })
    .json({ ok, message, ...payload });
};

export { errorResponse, authResponse };
