import mongoose from "mongoose";
var uuid = require('node-uuid');

const paidOutSchema = new mongoose.Schema({
  transactionID: { //nro de transaccion comercial 
    type: String, 
    default: function genUUID() {uuid.v1()}
  },
  numberCard:{  // 16numeros de la tarjetade credito
    type: integer,
    length: 16,
  },
  amountPaidOut: { // monto total pagado
    type: number,
    require: true, 
  },
  clientID:{  // nro de cliente, dado que el nro de tarjeta puede variar
    type: string,
  },


});

creditCardSchema.methods.toJSON = function () {
  const { __v,createdAt, updatedAt,...paidOut } = this.toObject();
  return paidOut;
};

export default mongoose.model("paidOut", paidOutSchema)
