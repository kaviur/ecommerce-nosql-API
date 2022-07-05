
import Stripe from 'stripe'
import { validatePassword } from "../helpers/bcrypt.helper.js";
import { createJWT } from "../helpers/jwt.helper.js";
import UserService from "./user.service.js";
import { v4 as uuid } from "uuid";
import cartModel from "../models/cart.model.js";
import sendEmail from "../libs/emails.js";
import {
  jwtSecret,
  apiVersion,
  callbackUrl,
  stripe_secret,
} from "../config/config.js";
import Jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { templateEmail } from "../libs/templateEmail.js";

export class AuthService {
  #userService;
  #stripe
  constructor() {
    this.#userService = new UserService();
    this.#stripe = new Stripe(stripe_secret);
  }

  async validateEmail(token) {
    try {
      const { email ,name, role} = Jwt.verify(token, jwtSecret);
    
      const userUpdate = await userModel.findOneAndUpdate(
        { email ,emailVerified:false},
        { emailVerified: true },
        { new: true }
      );

      if (!userUpdate) throw new Error("the token has already been redeemed");

      const { id: stripeCustomerId } = await this.#stripe.customers.create({
        name,
        email
      });

      userUpdate.stripeCustomerId = stripeCustomerId
      await userUpdate.save()

      console.log(userUpdate._id);
      const user = await createJWT(userUpdate);

      if (role === 1) {
        const cart = await cartModel.findOne({ _id: userUpdate._id });
        if (!cart) {
          const createCart= await cartModel.create({ _id: userUpdate._id, items: [] });

          if(createCart){
            return { success: true, user };
          }else{
            return { success: false, error: { message: "Error creating cart" } };
          }
        }
      }else{
        return { success: true, user };
      }

      //return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async signup(user, files = null) {
    const { name, email, password, image, role } = user;
    const response = await this.#userService.postUser(
      {
        name,
        email,
        password,
        image,
        role,
        provider: {
          local: true,
        },
      },
      files
    );
    if (response.success) {
      try {
        const { token } = await createJWT(response.user, "1h");
        const url = `${callbackUrl}/api/${apiVersion}/email_validation/${token}`;
        const htmlEmail = templateEmail(url, response.user.name);
        await sendEmail(response.user.email, "Confirm your email", htmlEmail);

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

  async socialLogin(profile) {
    const user = {
      name: profile.displayName,
      email: profile.emails[0].value,
      image: profile.photos[0].value,
      emailVerified: true,
      password: uuid(),
      provider: {
        [profile.provider]: true,
      },
      idProvider: {
        [profile.provider]: profile.id,
      },
    };
    try {
      const response = await this.#userService.socialLogin(
        user,
        profile.provider,
        profile.id
      );
      if (!response.success) return response;

      const data = await createJWT(response.user);
      response.user = data;
      return response;
    } catch (error) {
      return { success: false, error };
    }
  }
}
