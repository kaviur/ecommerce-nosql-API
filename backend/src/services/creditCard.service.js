import { creditCardModel } from "../models/index.js";
 
export class CreditCardservice {
  async getCreditCard(admin = false) {
    try {
      const data = !admin
        ? await creditCardModel.find({ status: true })
        : await creditCardModel.find();
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  async createCreditCard(name) {
    try {
      const creditcard = new creditCardModel({ name });
      await creditcard.save();
      return { success: true, creditcard };
    } catch (error) {
      return { success: false, error };
    }
  }

  async updateCreditCard(name, id) {
    try {
      const creditcard = await creditCardModel.findOne(
        {
          _id: id,
          status: true,
        },
        { new: true }
      );
      creditcard.name = name || creditcard.name;
      await creditcard.save();
      return { success: true, creditcard };
    } catch (error) {
      return { success: false, error };
    }
  }

  async changeStatus(id) {
    try {
      const creditcard = await creditCardModel.findOne({
        _id: id,
      });
      creditcard.status = !creditcard.status;
      await creditcard.save();
      return { success: true, creditcard };
    } catch (error) {
      return { success: false, error };
    }
  }
}
