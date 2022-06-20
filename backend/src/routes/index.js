import { AuhtRoute } from "./auth.routes.js";
import { CartRoute } from "./cart.route.js";
import { SubCategoryRoute } from "./subCategory.route.js";
import { UserRoute } from "./user.routes.js";
import { CategoryRoute } from "./category.routes.js";
import { ProductRoute } from "./product.routes.js";
import { ReviewRoute } from "./review.routes.js";

import { PaymentRoute } from "./payment.route.js";

const { router: userRoute } = new UserRoute();
const { router: authRoute } = new AuhtRoute();
const { router: categoryRoute } = new CategoryRoute();
const { router: subCategoryRoute } = new SubCategoryRoute();
const { router: cartRoute } = new CartRoute();
const { router: productRoute } = new ProductRoute();
const { router: reviewRoute } = new ReviewRoute();
const { router: paymentRoute } = new PaymentRoute();

export {
  userRoute,
  authRoute,
  categoryRoute,
  subCategoryRoute,
  productRoute,
  cartRoute,
  reviewRoute,
  paymentRoute,
};
