import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { favorites, properties } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const favoritesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.query.favorites.findMany({
      where: eq(favorites.userId, ctx.userId),
      with: {
        property: true,
      },
      orderBy: (fav, { desc }) => [desc(fav.createdAt)],
    });
    return items.map((f) => f.property);
  }),

  add: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.favorites.findFirst({
        where: and(
          eq(favorites.userId, ctx.userId),
          eq(favorites.propertyId, input.propertyId)
        ),
      });

      if (existing) {
        return { success: true, alreadyExists: true };
      }

      await ctx.db.insert(favorites).values({
        id: createId(),
        userId: ctx.userId,
        propertyId: input.propertyId,
      });

      return { success: true, alreadyExists: false };
    }),

  remove: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.userId),
            eq(favorites.propertyId, input.propertyId)
          )
        );
      return { success: true };
    }),

  check: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const fav = await ctx.db.query.favorites.findFirst({
        where: and(
          eq(favorites.userId, ctx.userId),
          eq(favorites.propertyId, input.propertyId)
        ),
      });
      return { isFavorite: !!fav };
    }),

  count: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.query.favorites.findMany({
      where: eq(favorites.userId, ctx.userId),
    });
    return { count: items.length };
  }),
});
