import { userModel } from "../models/index.js";

export default class UserService {
  async postUser(data) {
    try {
      const user = new userModel({ ...data });
      await user.save();
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email });
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getUsers(limit, page) {
    try {
      const { docs: users, ...information } = await userModel.paginate(
        {},
        { limit, page }
      );
      const data = { users, information };
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
}
