import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const reportsRouter = createTRPCRouter({
  insertWaveReport: publicProcedure
    .input(z.object({
      timestamp: z.date(),
      utcOffset: z.number(),
      waveHeightMin: z.number(),
      waveHeightMax: z.number(),
      humanRelation: z.string()
     }))
    .mutation(async ({ input, ctx }) => {
      
      await ctx.prisma.waveReports.create({
        data: {
          ...input
        }
      });

    }),
});
