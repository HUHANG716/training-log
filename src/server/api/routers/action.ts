import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const actionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.action.findMany({
      include: {
        movements: true,
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getByTemplateId: publicProcedure.input(z.object({ templateId: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.action.findMany({
      where: { templateId: input.templateId },
      include: {
        movements: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.action.findUnique({
      where: { id: input.id },
      include: {
        movements: true,
        template: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        templateId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.action.create({
        data: {
          name: input.name,
          templateId: input.templateId,
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
      return await ctx.db.action.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.action.delete({
      where: { id: input.id },
    });
  }),
});
