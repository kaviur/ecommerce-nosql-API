import { validatePassword } from "../helpers/bcrypt.helper.js";
import { createJWT } from "../helpers/jwt.helper.js";
import UserService from "./user.service.js";

export class AuthService {
  #userService;
  constructor() {
    this.#userService = new UserService();
  }

  async signup(user) {
    const { name, email, password, image, role } = user;
    const response = await this.#userService.postUser({
      name,
      email,
      password,
      image,
      role,
    });
    if (response.success) {
      try {
        const data = await createJWT(response.user);
        response.user = data;
        return response;
      } catch (error) {
        return { success: false, error };
      }
    }
    return response;
  }

  async login(data) {
    const { email, password } = data;
    try {
      const response = await this.#userService.getUserByEmail(email);
      if (!response.success) return response;

      const message = "Incorrect user or password";

      const isvalidPassord = await validatePassword(
        password,
        response.user?.password || null
      );

      if (!isvalidPassord || !response.user)
        return { success: false, status: 401, error: { message } };

      const data = await createJWT(response.user);
      response.user = data;
      return response;
    } catch (error) {
      return { success: false, status: 500, error };
    }
  }
}
