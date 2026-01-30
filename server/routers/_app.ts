import { router } from "../trpc";
import { propertiesRouter } from "./properties";
import { criteriaRouter } from "./criteria";
import { favoritesRouter } from "./favorites";
import { userRouter } from "./user";

export const appRouter = router({
  properties: propertiesRouter,
  criteria: criteriaRouter,
  favorites: favoritesRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
