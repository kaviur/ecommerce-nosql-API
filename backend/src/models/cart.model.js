import mongosee from "mongoose";

const cartSchema = new mongosee.Schema({
  _id: {
    type: mongosee.Schema.Types.ObjectId,
    ref: "User",
  },
  items: {
    type: Array,
    items: {
      _id: {
        type: mongosee.Schema.Types.ObjectId,
        ref: "Product",
        unique: [true, "The product already exists"],
      },
      amount: {
        type: Number,
        min: 0,
        default: 0,
        required: [true, "Amount is required"],
      },
    },
  },
});

cartSchema.methods.toJSON = function () {
  const { _v, ...cart } = this.toObject();
  return cart;
};

export default mongosee.model("Cart", cartSchema);
