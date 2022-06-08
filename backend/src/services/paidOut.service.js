import { paidOutModel } from "../models/index.js";

export class PaidOutservice {
  async getPaidOut(admin = false) {
    try {
      const data = !admin
        ? await paidOutModel.find({ status: true })
        : await paidOutModelModel.find();
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  async createPaidOut(name) {
    try {
      const paidout = new paidOutModel({ name });
      await paidout.save();
      return { success: true, paidout };
    } catch (error) {
      return { success: false, error };
    }
  }

 
}
