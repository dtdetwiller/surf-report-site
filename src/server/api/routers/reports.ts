import { WaveReports } from "@prisma/client";
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
      spotId: z.string(),
      hour: z.number()
    }))
    .query(async ({ctx, input}) => {
      
      return await ctx.prisma.waveReports.aggregateRaw({
        pipeline: [
          {
            $group: {
              _id: {
                date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                hour: { $hour: "$timestamp" }
              },
              surf_height: { $max: "$waveHeightMax" },
              report: { $first: "$$ROOT" }
            }
          },
          {
            $match: {
              "_id.hour": input.hour,
              "report.spotId": input.spotId
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$report.timestamp" } },
              surf_height: { $max: "$surf_height" },
              report: { $first: "$report" }
            }
          },
          {
            $project: {
              _id: 0,
              report: 1
            }
          },
          {
            $sort: {
              date: 1
            }
          }
        ]
      });
      
    }),

  removePastReportsBySpotId: publicProcedure
    .input(z.object({
      spotId: z.string(),
      date: z.date()
    }))
    .mutation(async ({ctx, input}) => {

      await ctx.prisma.waveReports.deleteMany({
        where: {
          spotId: input.spotId,
          timestamp: {
            lt: input.date
          }
        }
      })
    }),

});
