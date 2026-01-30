import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function createContext() {
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    // Auth not available (public routes, etc.)
    userId = null;
  }

  return {
    userId,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
