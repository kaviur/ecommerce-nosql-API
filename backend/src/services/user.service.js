import { createJWT } from "../helpers/jwt.js";
import { userModel } from "../models/index.js";

export default class UserService {
  async postUser(data) {
    const { name, email, password, image, role } = data;
    try {
      const user = new userModel({ name, email, password, image, role });
      await user.save();
      const data = await createJWT(user);
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
}
