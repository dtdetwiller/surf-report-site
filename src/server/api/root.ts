import { createTRPCRouter } from "~/server/api/trpc";
import { reportsRouter } from "./routers/reports";
import { spotsRouter } from "./routers/spots";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reports: reportsRouter,
  spots: spotsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
