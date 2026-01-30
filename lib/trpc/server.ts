import "server-only";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { headers } from "next/headers";
import type { AppRouter } from "@/server/routers/_app";
import superjson from "superjson";

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:3000`;
}

export const serverTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: async () => {
        const headersList = await headers();
        return {
          cookie: headersList.get("cookie") ?? "",
        };
      },
    }),
  ],
});
