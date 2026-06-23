# syntax=docker/dockerfile:1

# ---- Dependencies ----

# Separate stage so bun install is cached independently of source changes.
# If only source files change, this layer is reused and install is skipped.
FROM oven/bun:1.3.14 AS deps
WORKDIR /app

# Copy only the manifest + lockfile first so this layer stays cached
# and bun install is skippedgit on rebuilds where dependencies didn't change.
COPY package.json bun.lock* ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---- Builder ----

# Pinned to 1.3.14: confirmed working version with built-in bun user,
# no need for manual addgroup/adduser in the runner stage.
FROM oven/bun:1.3.14 AS builder
WORKDIR /app

# Copy pre-installed dependencies from the deps stage.
COPY --from=deps /app/node_modules ./node_modules

# Now bring in the rest of the source.
COPY . .

# Build-time only: prevents T3 env validation from failing when
# runtime-only env vars aren't present in the build environment.
ENV SKIP_ENV_VALIDATION=1

# Mounts the secret as a file only for this one RUN step.
# Never written to image layers, ENV, or build args — gone once this line finishes.
RUN --mount=type=secret,id=usgs_url \
    --mount=type=secret,id=fdsn_base_url \
    --mount=type=secret,id=sentry_auth_token \
    --mount=type=secret,id=next_public_sentry_dsn \
    USGS_URL="$(cat /run/secrets/usgs_url)" \
    FDSN_BASE_URL="$(cat /run/secrets/fdsn_base_url)" \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token)" \
    NEXT_PUBLIC_SENTRY_DSN="$(cat /run/secrets/next_public_sentry_dsn)" \
    bun run build

# ---- Runner ----

# Minimal image that only runs the prebuilt server — no source,
# dev dependencies, or package manager cache carried over.
# 1.3.14-slim is built on debian:13-slim (Trixie) — confirmed to ship
# with a built-in bun user, so no manual addgroup/adduser needed.
FROM oven/bun:1.3.14-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Must be 0.0.0.0, not localhost/127.0.0.1 — otherwise Docker's
# port mapping can't reach the server from outside the container.
ENV HOSTNAME=0.0.0.0

# .next/standalone already contains its own pruned node_modules,
# so a single copy of the directory is all that's needed.
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY --from=builder --chown=bun:bun /app/public ./public

USER bun
EXPOSE 3000
CMD ["bun", "server.js"]
