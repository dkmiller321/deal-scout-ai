import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { investmentCriteria } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const criteriaInput = z.object({
  name: z.string().min(1).max(100),
  minCapRate: z.number().min(0).max(100).optional(),
  minCashOnCash: z.number().min(0).max(100).optional(),
  maxPrice: z.number().min(0).optional(),
  propertyTypes: z.array(z.string()).optional(),
  targetMarkets: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const criteriaRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.query.investmentCriteria.findMany({
      where: eq(investmentCriteria.userId, ctx.userId),
      orderBy: (criteria, { desc }) => [desc(criteria.createdAt)],
    });
    return items;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const criteria = await ctx.db.query.investmentCriteria.findFirst({
        where: and(
          eq(investmentCriteria.id, input.id),
          eq(investmentCriteria.userId, ctx.userId)
        ),
      });
      return criteria;
    }),

  create: protectedProcedure
    .input(criteriaInput)
    .mutation(async ({ ctx, input }) => {
      const [criteria] = await ctx.db
        .insert(investmentCriteria)
        .values({
          id: createId(),
          userId: ctx.userId,
          ...input,
        })
        .returning();
      return criteria;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: criteriaInput.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [criteria] = await ctx.db
        .update(investmentCriteria)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(investmentCriteria.id, input.id),
            eq(investmentCriteria.userId, ctx.userId)
          )
        )
        .returning();
      return criteria;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(investmentCriteria)
        .where(
          and(
            eq(investmentCriteria.id, input.id),
            eq(investmentCriteria.userId, ctx.userId)
          )
        );
      return { success: true };
    }),

  toggleActive: protectedProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const [criteria] = await ctx.db
        .update(investmentCriteria)
        .set({
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(investmentCriteria.id, input.id),
            eq(investmentCriteria.userId, ctx.userId)
          )
        )
        .returning();
      return criteria;
    }),
});
