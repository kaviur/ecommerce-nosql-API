const {Router} = require("express")
const PaymentService = require("../services/payments.service")

// administro la ruta de webhooks, el cual es un endpoint de stripe
// y se encarga de confirmar el pago
// https://stripe.com/docs/webhooks
// https://stripe.com/docs/webhooks/signatures

// escucho los eventos de stripe:
// entorno local: http://localhost:3000/webhooks/stripe
// https://dashboard.stripe.com/test/webhooks
// https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local

function webhooks(app){
    const router = Router()
    const paymentServ = new PaymentService()

    app.use("/api/webhooks",router)

    router.post("/stripe",async (req,res)=>{
        const sig = req.headers['stripe-signature'];
        // recibe el certificado de stripe

        const result = await paymentServ.confirm(req.body,sig)

        return res.status(result.success?200:400).json(result)
    })
}

module.exports = webhooks