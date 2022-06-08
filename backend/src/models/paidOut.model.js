import mongoose from "mongoose";
// var uuid = require('node-uuid');

const PaidOutSchema = new mongoose.Schema({
  transactionID: { //nro de transaccion comercial 
    type: [String], // estados posibles 
    default: function genUUID() {uuid.v1()}
  },
  numberCard:{  // 4 ultimos nros
    type: integer,
    length: 4,
  },
  amountPaidOut: { // monto total pagado
    type: number,
    require: true, 
  },
  clientID:{  // nro de cliente, dado que el nro de tarjeta puede variar
    type: Schema.ObjectId, ref: "User"    
  },
  statusTransaction:{
    type: string, // Rechazado / Aprobado ...
    default: "Aprobado",
  },

},
{ timestamps: true });

creditCardSchema.methods.toJSON = function () {
  const { __v,createdAt, updatedAt,...paidOut } = this.toObject();
  return paidOut;
};

export default mongoose.model("PaidOut", paidOutSchema)
