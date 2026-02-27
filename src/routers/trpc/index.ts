import { router } from "./context.js";
import { urlRouter } from "./url.js";

export const trpcRouter = router({
    url: urlRouter
})