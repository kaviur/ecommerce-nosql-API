import { AuhtRoute } from "./auth.routes.js";
import { CartRoute } from "./cart.route.js";
import { SubCategoryRoute } from "./subCategory.route.js";
import { UserRoute } from "./user.routes.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: subCategoryRoute } = new SubCategoryRoute();
const { router: cartRoute } = new CartRoute();

export { userRoute, authRoute, subCategoryRoute,cartRoute };
