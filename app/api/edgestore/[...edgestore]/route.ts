import { db } from "@/lib/db";
import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import jwt from "jsonwebtoken";

type Context = {
  userId: string;
  userRole: string;
};

async function createContext({ req }: CreateContextOptions) {
  const token = req.cookies.get("token")?.value;
  const { id } = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string };

  const user = await db.user.findUnique({
    where: {
      id: id as string,
    },
    select: {
      id: true,
      role: true,
    },
  });

  return {
    userId: user?.id || "",
    userRole: user?.role || "",
  };
}

const es = initEdgeStore.context<Context>().create();
/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 10,
    })
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log("beforeDelete", ctx, fileInfo);
      return true;
    }),

  protectedFiles: es
    .fileBucket()
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      AND: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "Admin" },
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
