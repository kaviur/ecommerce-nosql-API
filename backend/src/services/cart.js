const CartModel = require("../models/cart")
const PaymentsService = require("./payments")

class Cart{
// traigo los items del carrito a cobrar, pasando el id del usuario
    async getItems(idUser){
        const result = await CartModel.findById(idUser).populate("items._id","name price")

        return result
    }

    async addToCart(idUser,idProduct,amount){
        const result = await CartModel.findByIdAndUpdate(idUser,{
            $push:{
                items:{
                    _id:idProduct,
                    amount
                }
            }
        },{new:true}).populate("items._id","name price")

        return result
    }

    async removeFromCart(idUser,idProduct){
        const result = await CartModel.findByIdAndUpdate(idUser,{
            $pull:{
                items:{
                    _id:idProduct
                }
            }
        },{new:true})

        return result
    }
// para el pago recibo el id del usuario:
    async pay(idUser){
        const {items} = await this.getItems(idUser)
        // me traigo los items del carrito con el metodo
        console.log(items)
        const total = items.reduce((result,item)=>{
            return result+(item._id.price*item.amount)
        },0)*100 //obtengo total

        const paymentsServ = new PaymentsService()
        const clientSecret = await paymentsServ.createIntent(total)
        return {
            success:true,
            clientSecret
        }
    }

    async create(idUser){
        const cart = await CartModel.create({
            _id:idUser,
            items:[]
        })

        return cart
    }


}

module.exports = Cart