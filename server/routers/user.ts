import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.clerkId, ctx.userId),
    });
    return user;
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        notificationFrequency: z
          .enum(["realtime", "daily", "weekly"])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, ctx.userId))
        .returning();
      return user;
    }),

  syncFromClerk: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.users.findFirst({
        where: eq(users.clerkId, ctx.userId),
      });

      if (existing) {
        const [user] = await ctx.db
          .update(users)
          .set({
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            imageUrl: input.imageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.clerkId, ctx.userId))
          .returning();
        return user;
      }

      const [user] = await ctx.db
        .insert(users)
        .values({
          clerkId: ctx.userId,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          imageUrl: input.imageUrl,
        })
        .returning();
      return user;
    }),
});
