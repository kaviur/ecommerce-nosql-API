import { deleteImages, uploadImage } from "../helpers/images.helper.js";
import { userModel } from "../models/index.js";

export default class UserService {
  async postUser(data, files = null) {
    let imagesName;
    try {
      const user = new userModel({ ...data });
      await user.save();
      if (files) {
        imagesName = await uploadImage(files);
        user.saveUrlImg(imagesName);
        await user.save();
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email, status: true });
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

  async updateUser(data, id, files = null) {
    let imagesName = [];

    try {
      const user = await userModel.findOne({ _id: id, status: true });

      if (!user) throw new Error("User not found");

      user.name = data.name || user.name;
      user.email = data.email || user.email;
      await user.save();
      if (data.password) user.changePassword(data.password);
      if (files) {
        if (user.image) await deleteImages(user.image);
        imagesName = await uploadImage(files);
        user.saveUrlImg(imagesName);
        await user.save();
      }

      return { success: true, user };
    } catch (error) {
      imagesName.length > 0 && (await deleteImages(imagesName));
      return { success: false, error };
    }
  }

  async updateUserAdmin(data, id, files = null) {
    let imagesName = [];

    try {
      const user = await userModel.findOne({ _id: id });

      if (!user) throw new Error("User not found");

      user.name = data.name || user.name;
      user.email = data.email || user.email;
      user.role = data.role || user.role;
      user.status = data.status || user.status;

      if (data.password) user.changePassword(data.password);
      await user.save();

      if (files) {
        if (user.image) await deleteImages(user.image);
        imagesName = await uploadImage(files);
        user.saveUrlImg(imagesName);
        await user.save();
      }
      return { success: true, user };
    } catch (error) {
      imagesName.length > 0 && (await deleteImages(imagesName));
      return { success: false, error };
    }
  }
}
