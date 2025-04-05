import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const templateRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.template.findMany({
      include: {
        actions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.template.findUnique({
      where: { id: input.id },
      include: {
        actions: {
          include: {
            movements: true,
          },
        },
      },
    });
  }),

  create: publicProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    return await ctx.db.template.create({
      data: {
        name: input.name,
      },
    });
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.template.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.template.delete({
      where: { id: input.id },
    });
  }),
});
