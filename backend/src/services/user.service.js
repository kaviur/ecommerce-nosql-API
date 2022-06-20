import { deleteImages, uploadImage } from "../helpers/images.helper.js";
import { cartModel, userModel } from "../models/index.js";
import Stripe from "stripe";
import { stripe_secret } from "../config/config.js";

export default class UserService {
  #stripe;
  constructor() {
    this.#stripe = new Stripe(stripe_secret);
  }
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
      const user = await userModel.findOne({
        email: email.toUpperCase(),
        status: true,
      });
      if (!user) throw new Error("User not found");
      if (!user.emailVerified) throw new Error("Email verification required");
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
      user.provider.local = true;
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

  async socialLogin(data, provider, idProvider) {
    let user;

    const { email } = data;
    try {
      user = await userModel.findOne({ email: email.toUpperCase() });
      console.log(user);
      if (user) {
        const cart = await cartModel.findOne({ _id: user._id });
        if (!cart) {
          await cartModel.create({ _id: user._id, items: [] });
        }
        if (user.idProvider[provider] === idProvider)
          return { success: true, user };
        user.provider[provider] = true;
        user.idProvider[provider] = idProvider;
        user.image = data.image;
        if (!user.emailVerified) {
          user.emailVerified = true;
          user.stripeCustomerId = await this.createCustomerId(user.name, user.email);
        }

        await user.save();
        return { success: true, user };
      }
      user = new userModel(data);

      user.stripeCustomerId = await this.createCustomerId(data.name, data.email);
      await user.save();
      await cartModel.create({ _id: user._id, items: [] });
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async createCustomerId(name, email) {
    const { id: stripeCustomerId } = await this.#stripe.customers.create({
      name,
      email,
    });
    return stripeCustomerId;
  }
}
