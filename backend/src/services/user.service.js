import { userModel } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

export default class UserService {
  async postUser(data) {
    try {
      const user = new userModel({ ...data });
      await user.save();
      return { created:true, success: true, user };
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

  async getOrCreate(data){
    const user = await userModel.findOne({provider:data.provider,idProvider:data.idProvider})
    if(user){
        return {
          success:true,
          created:true,
          user
        }
    }
    data.password = uuidv4()
    return await this.postUser(data)
  }
}
