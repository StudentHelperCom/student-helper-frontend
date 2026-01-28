# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app

COPY --link --from=deps /app/node_modules ./node_modules
COPY --link . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN if [ -z "$NEXT_PUBLIC_API_URL" ]; then \
      echo "ERROR: NEXT_PUBLIC_API_URL is required" && exit 1; \
    fi

ENV NEXTAUTH_URL="http://localhost:3000" \
    NEXTAUTH_SECRET="alY2t8F0rxOKf+M4wD24qTNNXqZTWYIw6tSRw1JCssA=" \
    INTERNAL_API_URL="http://localhost:4001"
ENV HOSTNAME="0.0.0.0"

RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/.next/cache \
    npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

COPY --link --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -f http://$(hostname -i):3000/api/health || exit 1

CMD ["node", "server.js"]