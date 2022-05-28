import { AuhtRoute } from "./auth.routes.js";
import { UserRoute } from "./user.routes.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();

export { userRoute, authRoute };
