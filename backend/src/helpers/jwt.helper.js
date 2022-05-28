import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";

export const createJWT = (user) => {
  const payload = {
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    id: user._id,
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: "15d" }, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve({ payload, token });
    });
  });
};
