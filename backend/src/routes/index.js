import { AuhtRoute } from "./auth.routes.js";
import { SubCategoryRoute } from "./subCategory.route.js";
import { UserRoute } from "./user.routes.js";
import { CategoryRoute } from "./category.routes.js";
import { ProductRoute } from "./product.routes.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: categoryRoute } = new CategoryRoute();
const { router: subCategoryRoute } = new SubCategoryRoute();
const { router: productRoute } = new ProductRoute();

export { userRoute, authRoute, categoryRoute, subCategoryRoute, productRoute };


