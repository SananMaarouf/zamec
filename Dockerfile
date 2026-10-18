# syntax=docker/dockerfile:1.6
############################################
# deps stage: install node dependencies once
############################################
FROM node:24-alpine AS deps
WORKDIR /app

# Only copy manifest files to maximize layer cache reuse
COPY package.json package-lock.json* ./

# devDependencies are required: Astro, Tailwind and the Sanity CLI/typegen
# toolchain all run at build time for a static site. Do not set NODE_ENV=production.
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

############################################
# builder stage: copy source & build static site
############################################
FROM node:24-alpine AS builder
WORKDIR /app

# Build arguments for environment variables (baked into static output)
ARG PUBLIC_SANITY_PROJECT_ID
ARG PUBLIC_SANITY_DATASET
ARG PUBLIC_SITE_URL
ARG BUILD_COMMIT="unknown"
ARG BUILD_TIMESTAMP="unknown"
ARG CONTENT_UPDATE_TOKEN="" # used to bust build cache on content-only updates

ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID \
	PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET \
	PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
	BUILD_COMMIT=$BUILD_COMMIT \
	BUILD_TIMESTAMP=$BUILD_TIMESTAMP

# Fail fast with a readable message instead of emitting a site with broken queries
RUN if [ -z "$PUBLIC_SANITY_PROJECT_ID" ] || [ -z "$PUBLIC_SANITY_DATASET" ]; then \
		echo "ERROR: PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET build args are required." >&2; \
		exit 1; \
	fi

# Bring in node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source (package.json/lock are included here, .dockerignore excludes node_modules)
COPY . .

# Build static site (cache busts when CONTENT_UPDATE_TOKEN changes)
RUN --mount=type=cache,target=/app/.astro \
	--mount=type=cache,target=/app/node_modules/.vite \
	echo "Content token: $CONTENT_UPDATE_TOKEN" > .content-buster && npm run build

############################################
# runtime stage: minimal nginx (non-root) serving /dist
############################################
FROM nginxinc/nginx-unprivileged:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Re-declare build args so LABEL substitutions work in this stage
ARG BUILD_COMMIT="unknown"
ARG BUILD_TIMESTAMP="unknown"

# Labels for traceability
LABEL org.opencontainers.image.source="https://github.com/SananMaarouf/zamec" \
	  org.opencontainers.image.revision=$BUILD_COMMIT \
	  org.opencontainers.image.created=$BUILD_TIMESTAMP

# Copy built assets
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
