import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { properties } from "@/lib/db/schema";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import { calculateInvestmentScore, generateAnalysis } from "@/lib/services/scoring";
import { createId } from "@paralleldrive/cuid2";

export const propertiesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
        filters: z
          .object({
            minPrice: z.number().optional(),
            maxPrice: z.number().optional(),
            minBeds: z.number().optional(),
            maxBeds: z.number().optional(),
            minScore: z.number().optional(),
            propertyType: z.string().optional(),
            city: z.string().optional(),
          })
          .optional(),
        sort: z
          .object({
            field: z.enum(["score", "price", "daysOnMarket", "createdAt"]),
            order: z.enum(["asc", "desc"]),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, filters, sort } = input;

      const conditions = [];

      if (filters?.minPrice) {
        conditions.push(gte(properties.price, filters.minPrice));
      }
      if (filters?.maxPrice) {
        conditions.push(lte(properties.price, filters.maxPrice));
      }
      if (filters?.minBeds) {
        conditions.push(gte(properties.bedrooms, filters.minBeds));
      }
      if (filters?.maxBeds) {
        conditions.push(lte(properties.bedrooms, filters.maxBeds));
      }
      if (filters?.minScore) {
        conditions.push(gte(properties.score, filters.minScore));
      }
      if (filters?.propertyType) {
        conditions.push(eq(properties.propertyType, filters.propertyType));
      }
      if (filters?.city) {
        conditions.push(eq(properties.city, filters.city));
      }

      const orderBy =
        sort?.field === "score"
          ? sort.order === "desc"
            ? desc(properties.score)
            : asc(properties.score)
          : sort?.field === "price"
            ? sort.order === "desc"
              ? desc(properties.price)
              : asc(properties.price)
            : sort?.field === "daysOnMarket"
              ? sort.order === "desc"
                ? desc(properties.daysOnMarket)
                : asc(properties.daysOnMarket)
              : desc(properties.createdAt);

      const items = await ctx.db.query.properties.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        limit: limit + 1,
        orderBy: [orderBy],
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const property = await ctx.db.query.properties.findFirst({
        where: eq(properties.id, input.id),
      });
      return property;
    }),

  getHotDeals: publicProcedure
    .input(z.object({ minScore: z.number().default(80) }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.query.properties.findMany({
        where: gte(properties.score, input.minScore),
        orderBy: [desc(properties.score)],
        limit: 20,
      });
      return items;
    }),

  getRecent: publicProcedure
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.query.properties.findMany({
        where: lte(properties.daysOnMarket, input.days),
        orderBy: [asc(properties.daysOnMarket)],
        limit: 20,
      });
      return items;
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        totalCount: sql<number>`count(*)`,
        avgScore: sql<number>`avg(${properties.score})`,
        avgPrice: sql<number>`avg(${properties.price})`,
        hotDealsCount: sql<number>`count(*) filter (where ${properties.score} >= 80)`,
        recentCount: sql<number>`count(*) filter (where ${properties.daysOnMarket} <= 7)`,
      })
      .from(properties);

    return result[0];
  }),

  analyze: publicProcedure
    .input(
      z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        price: z.number(),
        bedrooms: z.number(),
        bathrooms: z.number(),
        sqft: z.number().optional(),
        yearBuilt: z.number().optional(),
        propertyType: z.enum(["single_family", "multi_family", "condo", "townhouse", "apartment"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Estimate rent using simple formula (can be enhanced with HUD data later)
      const baseRentRate = 0.008; // 0.8% of property value
      const bedroomMultiplier = 1 + (input.bedrooms - 2) * 0.1;
      const monthlyRent = Math.round(
        input.price * baseRentRate * Math.max(0.8, Math.min(1.2, bedroomMultiplier))
      );

      // Calculate financial metrics
      const annualRent = monthlyRent * 12;
      const expenses = annualRent * 0.4; // 40% expense ratio
      const noi = annualRent - expenses;
      const capRate = input.price > 0 ? (noi / input.price) * 100 : 0;

      // Cash on cash calculation (assuming 25% down, 7% interest, 30yr)
      const downPayment = input.price * 0.25;
      const loanAmount = input.price * 0.75;
      const monthlyPayment =
        (loanAmount * (0.07 / 12)) / (1 - Math.pow(1 + 0.07 / 12, -360));
      const annualDebtService = monthlyPayment * 12;
      const cashFlow = noi - annualDebtService;
      const cashOnCash = downPayment > 0 ? (cashFlow / downPayment) * 100 : 0;

      // Calculate investment score
      const scoreResult = calculateInvestmentScore({
        price: input.price,
        monthlyRent,
        capRate: capRate > 0 ? capRate : undefined,
        cashOnCash: cashOnCash > 0 ? cashOnCash : undefined,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        sqft: input.sqft,
        yearBuilt: input.yearBuilt,
        propertyType: input.propertyType,
      });

      // Generate analysis
      const analysis = generateAnalysis(
        {
          price: input.price,
          monthlyRent,
          capRate: capRate > 0 ? capRate : undefined,
          cashOnCash: cashOnCash > 0 ? cashOnCash : undefined,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          sqft: input.sqft,
          yearBuilt: input.yearBuilt,
          propertyType: input.propertyType,
        },
        scoreResult
      );

      return {
        score: scoreResult.score,
        monthlyRent,
        capRate,
        cashOnCash,
        analysis,
        breakdown: scoreResult.breakdown,
        insights: scoreResult.insights,
      };
    }),

  save: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        price: z.number(),
        bedrooms: z.number(),
        bathrooms: z.number(),
        sqft: z.number().optional(),
        yearBuilt: z.number().optional(),
        propertyType: z.enum(["single_family", "multi_family", "condo", "townhouse", "apartment"]),
        score: z.number(),
        capRate: z.number().optional(),
        cashOnCash: z.number().optional(),
        monthlyRent: z.number(),
        analysis: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newProperty = await ctx.db
        .insert(properties)
        .values({
          id: createId(),
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zipCode,
          propertyType: input.propertyType,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          sqft: input.sqft || null,
          yearBuilt: input.yearBuilt || null,
          price: input.price,
          capRate: input.capRate || null,
          cashOnCash: input.cashOnCash || null,
          monthlyRentEstimate: input.monthlyRent,
          score: input.score,
          daysOnMarket: 0,
          listingSource: "user_submitted",
          aiAnalysis: input.analysis,
          dataSource: "user",
          lastSyncedAt: new Date(),
        })
        .returning();

      return newProperty[0];
    }),
});
