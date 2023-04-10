import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const reportsRouter = createTRPCRouter({
  insertWaveReport: publicProcedure
    .input(z.object({
      spotId: z.string(),
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
  
  get16DayReportBySpotId: publicProcedure
    .input(z.object({
      spotId: z.string()
    }))
    .query(({ctx, input}) => {
      
      return ctx.prisma.waveReports.findMany({
        where: {
          spotId: input.spotId
        }
      })
    })
});
