import mongosee from "mongoose";

const cartSchema = new mongosee.Schema({
  _id: {
    type: mongosee.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      _id: {
        type: mongosee.Schema.Types.ObjectId,
        ref: "Product",
      },
      amount: Number
    },
  ],
});

cartSchema.methods.toJSON = function () {
  const { _v, ...cart } = this.toObject();
  return cart;
};

export default mongosee.model("Cart", cartSchema);
