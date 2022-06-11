import mongoose from "mongoose";
// var uuid = require('node-uuid'); // cómo sería con import?

const creditCardSchema = new mongoose.Schema({

  titularName: { // nombre como figura en el plastico
    type: String,
    require: [true, "The titular name is required"],
    trim: true,
    uppercase: true,
  },
  clientID:{  // nro de cliente ¿lo sacamos del nro de usuario? cómo se representa eso?
    type: Schema.ObjectId, ref: "Users" 
  },
  numberCard:{  // 4 ultimos nros
    type: integer,
    length: 16,
  },
  dueMonth:{  // 4 ultimos nros
    type: integer,
    length: 2,
  },
  dueYear:{  // 4 ultimos nros
    type: integer,
    length: 2,
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

},
{ timestamps: true });

creditCardSchema.methods.toJSON = function () {
  const { __v,createdAt, updatedAt,...creditCard } = this.toObject();
  return creditCard;
};

export default mongoose.model("CreditCard", creditCardSchema)
