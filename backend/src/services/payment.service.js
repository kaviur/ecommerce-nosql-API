import Stripe from "stripe";
import { endpointsecretStripe, stripe_secret } from "../config/config.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import { CartService } from "./cart.service.js";

export class PaymentService {
  #stripe;
  #cartService;
  constructor() {
    this.#stripe = new Stripe(stripe_secret);
    this.#cartService = new CartService();
  }

  //Payment session
  async paymentIntent(amount, stripeCustomerId) {
    try {
      const intent = await this.#stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer: stripeCustomerId,
      });
      return { success: true, clientSecret: intent.client_secret };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async payCart(idUer, stripeCustomerId) {
    try {
      const response = await this.#cartService.getCart(idUer);
      if (!response.success) return response;
      const {
        cart: { items },
      } = response;
      if (items.length === 0)
        return { success: false, error: "There are no items in the cart" };

      const total =
        items.reduce((result, item) => {
          return result + item._id.price * item.amount;
        }, 0) * 100;
      return await this.paymentIntent(total, stripeCustomerId);
    } catch (error) {
      return { success: false, error };
    }
  }

  async confirmPayment(data, signature) {
    let event;
    try {
      event = this.#stripe.webhooks.constructEvent(
        data,
        signature,
        endpointsecretStripe
      );
    } catch (error) {
      return { succes: false, error };
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(paymentIntent);
        const stripeCustomerId = paymentIntent.customer;

        try {
          const user = await userModel.findOne({ stripeCustomerId });
          const cart = await cartModel.findOne(user._id);
          const { items } = cart;
          let promises = [];

          // Then define and call a function to handle the event payment_intent.succeeded
          items.forEach((item) => {
            promises.push(
              productModel.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.amount },
              })
            );
          });
          cart.items = [];
          promises.push(cart.save())
          await Promise.all(promises);
        } catch (error) {
          console.log(error);
        }
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { succes: true };
  }
}
