import mongoose from "mongoose";
var uuid = require('node-uuid'); // cómo sería con import?

const creditCardSchema = new mongoose.Schema({

  titularName: {
    type: String,
    require: [true, "The titular name is required"],
    trim: true,
    uppercase: true,
  },
  clientID:{  // nro de cliente ¿lo sacamos del nro de usuario? cómo se representa eso?
    type: string,
  },
  numberCard:{ // identificacion del plastico usado
    type: integer,
    length: 16,
  },
  expirationMonth:{
    type: integer,
    default: true,
  },
  expirationYear:{
    type: integer,
    default: true,
  },
  isCC:{ // si es creditcard = true, si es tarjeta de debito es false
    type: Boolean,
    default: true,
  },
  brandCard:{
    type: integer,
    default: "VISA",
    trim: true,
    uppercase: true,
  },
  status:{
    type: Boolean,
    default: true,
  },

});

creditCardSchema.methods.toJSON = function () {
  const { __v,createdAt, updatedAt,...creditCard } = this.toObject();
  return creditCard;
};

export default mongoose.model("creditCard", creditCardSchema)
