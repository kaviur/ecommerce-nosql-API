import { AuhtRoute } from "./auth.routes.js";
import { SubCategoryRoute } from "./subCategory.route.js";
import { UserRoute } from "./user.routes.js";
import { CategoryRoute } from "./category.routes.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: categoryRoute } = new CategoryRoute();
const { router: subCategoryRoute } = new SubCategoryRoute();

export { userRoute, authRoute, categoryRoute, subCategoryRoute };


