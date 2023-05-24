import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const reportsRouter = createTRPCRouter({
  // insertWaveReport: publicProcedure
  //   .input(z.object({
  //     spotId: z.string(),
  //     timestamp: z.date(),
  //     utcOffset: z.number(),
  //     waveHeightMin: z.number(),
  //     waveHeightMax: z.number(),
  //     humanRelation: z.string()
  //    }))
  //   .mutation(async ({ input, ctx }) => {
      
  //     await ctx.prisma.waveReports.create({
  //       data: {
  //         ...input
  //       }
  //     });

  //   }),
  
  getWaveReportBySpotId: publicProcedure
    .input(z.object({
      spotId: z.string()
    }))
    .query(async ({ctx, input}) => {
      
      return await ctx.prisma.waveReports.findMany({
        where: {
          spotId: input.spotId
        }
      });
      
    }),

  // removePastReportsBySpotId: publicProcedure
  //   .input(z.object({
  //     spotId: z.string()
  //   }))
  //   .mutation(async ({ctx, input}) => {

  //     await ctx.prisma.waveReports.deleteMany({
  //       where: {
  //         spotId: input.spotId,
  //       }
  //     })
  //   }),

});
