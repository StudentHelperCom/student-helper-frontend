import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
        NEXTAUTH_URL: z.string().url(),
        NEXTAUTH_SECRET: z.string().min(1),
        INTERNAL_API_URL: z.string().url(),
    },

    client: {
        NEXT_PUBLIC_API_URL: z.string().url(),
    },

    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    },

    emptyStringAsUndefined: true,
});