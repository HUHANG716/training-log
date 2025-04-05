import { postRouter } from '@/server/api/routers/post';
import { templateRouter } from '@/server/api/routers/template';
import { actionRouter } from '@/server/api/routers/action';
import { movementRouter } from '@/server/api/routers/movement';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  template: templateRouter,
  action: actionRouter,
  movement: movementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
