import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const movementRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.movement.findMany({
      include: {
        Action: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getByActionId: publicProcedure.input(z.object({ actionId: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.movement.findMany({
      where: { actionId: input.actionId },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.movement.findUnique({
      where: { id: input.id },
      include: {
        Action: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        weight: z.number(),
        reps: z.number(),
        note: z.string(),
        actionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.movement.create({
        data: {
          weight: input.weight,
          reps: input.reps,
          note: input.note,
          actionId: input.actionId,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        weight: z.number(),
        reps: z.number(),
        note: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.movement.update({
        where: { id: input.id },
        data: {
          weight: input.weight,
          reps: input.reps,
          note: input.note,
        },
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.movement.delete({
      where: { id: input.id },
    });
  }),
});
