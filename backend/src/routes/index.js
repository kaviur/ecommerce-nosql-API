import { AuhtRoute } from "./auth.routes.js";
import { CartRoute } from "./cart.route.js";
import { SubCategoryRoute } from "./subCategory.route.js";
import { UserRoute } from "./user.routes.js";
import { CategoryRoute } from "./category.routes.js";
import { ProductRoute } from "./product.routes.js";
import { Webhooks } from "./webhooks.routes.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: categoryRoute } = new CategoryRoute();
const { router: subCategoryRoute } = new SubCategoryRoute();
const { router: cartRoute } = new CartRoute();
const { router: productRoute } = new ProductRoute();
const { router: webhooksRoute } = new Webhooks();

export { userRoute, authRoute, categoryRoute, subCategoryRoute, productRoute,cartRoute, webhooksRoute };


