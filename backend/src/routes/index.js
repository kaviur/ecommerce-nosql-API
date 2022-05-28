import { AuhtRoute } from "./auth.routes.js";
import { UserRoute } from "./user.routes.js";
import { CategoryRoute } from "./category.routes.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: categoryRoute } = new CategoryRoute();

export { userRoute, authRoute, categoryRoute };
