import { AuhtRoute } from "./auth.routes.js";
import { SubCategoryRoute } from "./subCategory.routes.js";
import { UserRoute } from "./user.routes.js";
import { CreditCardRoute } from "./creditCard.routes.js";
import { PaidOutRoute } from "./paidOut.routes.js";  


const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: subCategoryRoute } = new SubCategoryRoute();
const { router: creditCardRoute } = new CreditCardRoute();
const { router: paidOutRoute } = new PaidOutRoute();


export { userRoute, authRoute, subCategoryRoute, paidOutRoute, creditCardRoute };
