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
    .query(({ input, ctx }) => {
      return ctx.prisma.spots.findUnique({
        where: {
          spotId: input.spotId,
        }
      });
    }),
  
  getSpotsForSelect: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.spots.findMany({
        select: {
          spotId: true,
          name: true
        }
      });
    }),

  insertNewSpot: publicProcedure
    .input(z.object({
      spotId: z.string(),
      name: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      
      await ctx.prisma.spots.create({
        data: {
          ...input
        }
      });

    }),

});
