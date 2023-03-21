import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const spotsRouter = createTRPCRouter({
  spotBySpotId: publicProcedure
    .input(z.object({
      spotId: z.string()
     }))
    .query(async ({ input, ctx }) => {
      
      await ctx.prisma.spots.findUnique({
        where: {
          spotId: input.spotId
        }
      })

    }),
});
