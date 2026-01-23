# 🐳 Docker Guide: Student Helper Frontend

**Author**: Your DevOps Mentor  
**Last Updated**: January 23, 2026  
**Project**: Student Helper - Exam Preparation Platform

---

## 📑 Table of Contents

1. [Introduction](#introduction)
2. [Stack Analysis](#stack-analysis)
3. [Multi-Stage Builds Explained](#multi-stage-builds-explained)
4. [Dockerfile Breakdown](#dockerfile-breakdown)
5. [Docker Compose Explained](#docker-compose-explained)
6. [Optimization Strategies](#optimization-strategies)
7. [Security Best Practices](#security-best-practices)
8. [Usage Instructions](#usage-instructions)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## 🎯 Introduction

This guide teaches you how to containerize a Next.js 15 frontend application with React 19 using Docker best practices. You'll learn about multi-stage builds, layer caching, security hardening, and production optimization.

### Why Docker for This Project?

In a microservices architecture with 6 services, Docker provides:
- **Consistency**: "Works on my machine" becomes "works everywhere"
- **Isolation**: Each service runs independently with its own dependencies
- **Scalability**: Easy to scale individual services on Render.com
- **Portability**: Deploy anywhere Docker runs (local, staging, production)

---

## 🔍 Stack Analysis

### Current Technology Stack

```
Frontend Stack:
├── Next.js 15.5.7 (with App Router)
├── React 19.1.0
├── TypeScript 5.x
├── TanStack Query (React Query)
├── NextAuth.js
├── Tailwind CSS 4.x
├── Sass
└── Various UI libraries
```

### Specific Challenges

#### 1. **Next.js Standalone Output**
- **Challenge**: Next.js bundles node_modules by default, creating bloated images
- **Solution**: Use `output: 'standalone'` to create minimal production bundle
- **Benefit**: Reduces image size from ~1GB to ~200-300MB

#### 2. **React 19 Peer Dependencies**
- **Challenge**: Some packages haven't updated for React 19 compatibility
- **Solution**: Use `--legacy-peer-deps` flag during installation
- **Impact**: Allows installation despite peer dependency warnings

#### 3. **Environment Variables**
- **Challenge**: Next.js needs env vars at both build-time and runtime
- **Solution**: Use ARG for build-time, ENV for runtime
- **Details**: `NEXT_PUBLIC_*` vars are embedded during build

#### 4. **Build Performance**
- **Challenge**: npm install is slow and can fail on network issues
- **Solution**: Use `npm ci` for faster, reproducible installs
- **Bonus**: Docker layer caching speeds up rebuilds

---

## 🏗️ Multi-Stage Builds Explained

### What Are Multi-Stage Builds?

Multi-stage builds use multiple `FROM` statements in a single Dockerfile. Each `FROM` creates a new stage, and you can copy artifacts between stages.

### Why Use Multi-Stage Builds?

```
Single Stage (❌ DON'T):
┌─────────────────────────┐
│ All dependencies        │
│ + Source code           │  ➜ Image Size: ~1.2GB
│ + Build artifacts       │
│ + Dev tools             │
└─────────────────────────┘

Multi-Stage (✅ DO):
Stage 1: Dependencies      Stage 2: Build           Stage 3: Runtime
┌──────────────────┐      ┌──────────────────┐     ┌──────────────────┐
│ Install deps     │  ➜   │ Copy deps        │ ➜   │ Copy runtime     │
│                  │      │ Copy source      │     │ files only       │
│                  │      │ Build app        │     │                  │
└──────────────────┘      └──────────────────┘     └──────────────────┘
                                                     Image Size: ~200MB
```

### Benefits

1. **Smaller Images**: Final image contains only runtime necessities
2. **Security**: No source code or build tools in production image
3. **Faster Deployment**: Smaller images = faster uploads and container starts
4. **Layer Caching**: Docker caches each stage independently
5. **Clean Separation**: Clear distinction between build and runtime

### Our Three Stages

#### Stage 1: Dependencies (`deps`)
```dockerfile
FROM node:20-alpine AS deps
```
- **Purpose**: Install all npm dependencies
- **Output**: Complete node_modules directory
- **Why Separate**: Dependencies change less frequently than code

#### Stage 2: Builder (`builder`)
```dockerfile
FROM node:20-alpine AS builder
```
- **Purpose**: Build the Next.js application
- **Output**: Optimized production build in `.next/`
- **Why Separate**: Keep build tools out of final image

#### Stage 3: Runner (`runner`)
```dockerfile
FROM node:20-alpine AS runner
```
- **Purpose**: Run the application in production
- **Output**: Final, minimal image
- **Contains**: Only runtime files (no source, no build tools)

---

## 📦 Dockerfile Breakdown

Let's analyze each section of our Dockerfile:

### Stage 1: Dependencies Installation

```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps
```

**Line-by-Line Explanation:**

1. **`FROM node:20-alpine AS deps`**
   - Uses Node.js 20 on Alpine Linux (minimal base image, ~5MB)
   - `AS deps` names this stage for later reference
   - Alpine reduces image size by ~90% vs Ubuntu-based images

2. **`RUN apk add --no-cache libc6-compat`**
   - Alpine uses `musl` libc, but some Node packages expect `glibc`
   - `libc6-compat` provides compatibility layer
   - `--no-cache` doesn't store package index, saves space

3. **`WORKDIR /app`**
   - Sets working directory to `/app` in container
   - All subsequent commands run from here
   - Creates directory if it doesn't exist

4. **`COPY package.json package-lock.json* ./`**
   - Copies only package files (not entire codebase)
   - `*` makes package-lock optional (handles npm vs yarn)
   - **Critical for caching**: If these don't change, Docker reuses cached layer

5. **`RUN npm ci --legacy-peer-deps`**
   - `npm ci` ("clean install") is faster and more reliable than `npm install`
   - Requires package-lock.json, ensures reproducible builds
   - `--legacy-peer-deps` handles React 19 peer dependency issues

### Stage 2: Build Stage

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build
```

**Key Concepts:**

1. **`COPY --from=deps`**
   - Copies node_modules from previous stage
   - Avoids reinstalling dependencies
   - Each stage starts fresh; `--from` enables inter-stage copying

2. **`ARG` vs `ENV`**
   - **ARG**: Available only during build, not in final image
   - **ENV**: Available during build AND runtime
   - Next.js needs both: ARG for passing values, ENV for build process

3. **Why Environment Variables Here?**
   - Next.js performs static optimization during build
   - `NEXT_PUBLIC_*` variables are embedded in JavaScript bundles
   - Server-side variables (NEXTAUTH_*) needed for API route optimization

4. **Build Process**
   - Creates optimized production build
   - Generates standalone output (minimal dependencies)
   - Outputs to `.next/` directory

### Stage 3: Production Runtime

```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
```

**Critical Security & Optimization:**

1. **Non-Root User**
   ```dockerfile
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   USER nextjs
   ```
   - **Why**: Running as root is security risk
   - **How**: Create system user/group with specific IDs
   - **Benefit**: If container compromised, attacker has limited permissions

2. **File Ownership**
   ```dockerfile
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   ```
   - Sets correct ownership during copy
   - Ensures non-root user can read/execute files
   - More efficient than separate `chown` command

3. **Standalone Output**
   ```dockerfile
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   ```
   - Next.js traces used dependencies and copies only needed files
   - Dramatically reduces image size
   - Includes minimal node_modules subset

4. **Health Check**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3
   ```
   - Docker periodically checks if container is healthy
   - Calls `/api/health` endpoint
   - Orchestrators (like Render.com) use this to detect failures
   - **Parameters**:
     - `interval`: How often to check
     - `timeout`: How long to wait for response
     - `retries`: How many failures before marking unhealthy
     - `start-period`: Grace period during startup

5. **Network Binding**
   ```dockerfile
   ENV HOSTNAME="0.0.0.0"
   ```
   - Binds to all network interfaces
   - Without this, Next.js only listens on localhost
   - Necessary for Docker networking

---

## 🎼 Docker Compose Explained

Docker Compose orchestrates multiple containers. Even with one service, it's valuable for:
- Managing environment variables
- Defining networks for future microservices
- Setting resource limits
- Configuring restart policies

### Key Sections

#### Build Configuration

```yaml
build:
  context: .
  dockerfile: Dockerfile
  args:
    NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
  target: runner
```

- **context**: Where to find Dockerfile and source files
- **args**: Pass build-time variables (must match ARG in Dockerfile)
- **target**: Which stage to build (defaults to last stage)

#### Environment Variables

```yaml
environment:
  NODE_ENV: production
  NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
```

- Runtime environment variables
- `${VAR}` syntax reads from `.env` file or shell
- Separate from build args (these are for runtime)

#### Networks

```yaml
networks:
  - student-helper-network
```

- Creates isolated network for your microservices
- Services on same network can communicate by service name
- When you add backend services, use the same network

#### Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
```

- Prevents one service from consuming all resources
- Essential in production environments
- Helps with cost prediction and stability

#### Health Check

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "..."]
  interval: 30s
  timeout: 3s
  retries: 3
  start_period: 10s
```

- Duplicates Dockerfile HEALTHCHECK (Docker Compose has precedence)
- Render.com and other platforms use this
- Enables automatic restarts and load balancer integration

---

## ⚡ Optimization Strategies

### 1. Layer Caching Strategy

Docker caches each instruction as a layer. Order matters!

**Optimization Order (least to most frequently changed):**

```dockerfile
1. Base image               (FROM)       ← Changes rarely
2. System packages          (RUN apk)    ← Changes rarely  
3. Package files            (COPY package*.json)  ← Changes occasionally
4. Dependencies             (RUN npm ci)  ← Changes occasionally
5. Source code              (COPY . .)   ← Changes frequently
6. Build                    (RUN npm build) ← Changes frequently
```

**Cache Invalidation:**
- When a layer changes, ALL subsequent layers rebuild
- This is why we copy package.json BEFORE copying source code
- If cache invalidates at step 5, steps 1-4 reuse cache

### 2. `.dockerignore` Optimization

Exclude files from build context:

```
node_modules/   ← We install fresh in container
.next/          ← We build in container
.git/           ← Not needed for runtime
*.md            ← Documentation not needed
.env*.local     ← Prevent secrets from entering image
```

**Benefits:**
- Faster builds (less data to send to Docker daemon)
- Smaller context (less memory usage)
- Security (prevents accidental secret inclusion)

### 3. Next.js Standalone Mode

**Enable in `next.config.ts`:**

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

**What It Does:**
- Traces which dependencies are actually used
- Creates minimal output with only required files
- Reduces typical node_modules from ~300MB to ~30MB

**Result Structure:**
```
.next/
├── standalone/
│   ├── node_modules/    (minimal)
│   ├── server.js        (entry point)
│   └── .next/
└── static/              (copy separately)
```

### 4. Alpine Linux

**Why Alpine?**
- Regular Node image: ~900MB
- Alpine Node image: ~180MB
- **Savings: ~720MB** just from base image choice

**Trade-offs:**
- Uses musl instead of glibc (rare compatibility issues)
- Smaller package ecosystem
- Slightly different shell (ash vs bash)

### 5. Build Argument Caching

```dockerfile
ARG BUILDTIME_VAR
ENV BUILDTIME_VAR=$BUILDTIME_VAR
```

- If build args change, only layers after ARG rebuild
- Dependency installation layers remain cached
- Speeds up builds when only env vars change

---

## 🔒 Security Best Practices

### 1. Non-Root User

**Why It Matters:**
- Root access in container = potential host compromise
- Many attacks rely on root privileges
- Defense in depth: limit damage if container breached

**Implementation:**
```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

**Result:**
- Application runs as user ID 1001
- Cannot modify system files
- Cannot install packages or bind to privileged ports

### 2. Minimal Base Images

**Alpine vs Ubuntu:**
```
Alpine:  ~180MB, ~20 packages
Ubuntu:  ~900MB, ~200 packages
```

**Attack Surface:**
- Fewer packages = fewer potential vulnerabilities
- Smaller image = less to scan for CVEs
- Faster security patches (less to update)

### 3. Multi-Stage Separation

**Build Stage (not in final image):**
- npm (can run arbitrary scripts)
- Source code (might contain secrets in comments)
- Build tools (TypeScript, Webpack, etc.)
- Development dependencies

**Runtime Stage (final image):**
- Only compiled JavaScript
- Only production dependencies
- No build tools or source code

### 4. Secrets Management

**Never Do This:**
```dockerfile
ENV NEXTAUTH_SECRET=my-secret-key    ← NEVER HARDCODE
```

**Do This Instead:**
```dockerfile
ARG NEXTAUTH_SECRET                   ← Build-time variable
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET  ← Pass to runtime
```

**In Production:**
- Use Render.com environment variables
- Or Docker secrets in Swarm/Kubernetes
- Never commit secrets to repository

### 5. Regular Updates

```bash
# Check for vulnerabilities
docker scan student-helper-frontend:latest

# Update base image regularly
docker pull node:20-alpine
docker build --no-cache -t student-helper-frontend .
```

---

## 🚀 Usage Instructions

### Prerequisites

```bash
# Check installations
docker --version        # Should be 20.10+
docker-compose --version # Should be 1.29+ or 2.0+
node --version          # Should be 20.x (for local dev)
```

### Step 1: Environment Setup

Create `.env` file in project root:

```bash
# .env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
```

**Generate Secure Secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 255 }))
```

### Step 2: Enable Standalone Mode

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // ← Add this line
};

export default nextConfig;
```

### Step 3: Build the Image

```bash
# Build using docker-compose (recommended)
docker-compose build

# Or build directly with docker
docker build -t student-helper-frontend .
```

**Build Process:**
1. Docker reads Dockerfile
2. Executes each instruction in order
3. Creates layers (cached for future builds)
4. Tags final image as `student-helper-frontend`

### Step 4: Run the Container

```bash
# Run using docker-compose (recommended)
docker-compose up -d

# Or run directly with docker
docker run -d \
  --name student-helper-frontend \
  -p 3000:3000 \
  --env-file .env \
  student-helper-frontend
```

**Flags Explained:**
- `-d`: Detached mode (runs in background)
- `--name`: Container name (easier to reference)
- `-p 3000:3000`: Port mapping (host:container)
- `--env-file`: Load environment variables from file

### Step 5: Verify Deployment

```bash
# Check if container is running
docker ps

# Check logs
docker-compose logs -f frontend

# Check health status
docker inspect --format='{{.State.Health.Status}}' student-helper-frontend

# Test the application
curl http://localhost:3000/api/health
```

### Step 6: Stop and Clean Up

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove images
docker rmi student-helper-frontend
```

---

## 🔧 Troubleshooting

### Issue 1: Build Fails with Peer Dependency Error

**Error:**
```
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^18.0.0" from some-package@1.0.0
```

**Solution:**
Verify `--legacy-peer-deps` is in Dockerfile:
```dockerfile
RUN npm ci --legacy-peer-deps
```

### Issue 2: Container Exits Immediately

**Check logs:**
```bash
docker logs student-helper-frontend
```

**Common Causes:**
1. **Missing environment variables**
   - Solution: Check `.env` file exists and has all required vars

2. **Port already in use**
   ```bash
   # Check what's using port 3000
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000                 # Linux/Mac
   ```

3. **Health check failing**
   - Ensure `/api/health` endpoint exists
   - Check server.js is in correct location

### Issue 3: Changes Not Reflecting

**Cause:** Docker using cached layers

**Solution:**
```bash
# Rebuild without cache
docker-compose build --no-cache

# Or force rebuild
docker-compose up --build --force-recreate
```

### Issue 4: Large Image Size

**Check image size:**
```bash
docker images student-helper-frontend
```

**Expected:** ~200-300MB  
**If larger:**

1. Verify standalone mode is enabled in next.config.ts
2. Check .dockerignore is excluding node_modules, .next
3. Ensure multi-stage build is working (check Dockerfile)

**Debug:**
```bash
# See image layers
docker history student-helper-frontend

# See image contents
docker run --rm -it student-helper-frontend sh
ls -lah
du -sh *
```

### Issue 5: Cannot Connect to Backend

**From Inside Container:**
```bash
# Test connection
docker exec -it student-helper-frontend sh
wget http://gateway:8080/health  # Use service name, not localhost
```

**Common Mistakes:**
- Using `localhost` in `NEXT_PUBLIC_API_URL` (use service name or external URL)
- Services not on same Docker network
- Backend not running

**Fix:**
```yaml
# In docker-compose.yml
networks:
  - student-helper-network  # Ensure both frontend and backend use this
```

### Issue 6: Permission Denied Errors

**Error:**
```
EACCES: permission denied
```

**Cause:** File ownership issues with non-root user

**Debug:**
```bash
docker exec -it student-helper-frontend sh
ls -la /app/.next
whoami  # Should be "nextjs"
```

**Fix:** Verify all COPY commands use `--chown=nextjs:nodejs`

---

## 🎓 Next Steps

### For This Project

1. **Create Backend Dockerfile**
   - Apply same multi-stage principles
   - Handle NestJS build process
   - Consider TypeORM migrations

2. **Unified docker-compose.yml**
   - Add all 6 services
   - Configure inter-service networking
   - Set up PostgreSQL connection
   - Add Redis for caching

3. **CI/CD Pipeline**
   - Automate builds on GitHub Actions
   - Push images to Docker Hub or GitHub Container Registry
   - Deploy to Render.com automatically

4. **Monitoring**
   - Add health checks to all services
   - Set up logging aggregation
   - Monitor resource usage

### Learning Resources

1. **Docker Documentation**
   - Multi-stage builds: https://docs.docker.com/build/building/multi-stage/
   - Best practices: https://docs.docker.com/develop/dev-best-practices/

2. **Next.js + Docker**
   - Official guide: https://nextjs.org/docs/deployment#docker-image
   - Standalone output: https://nextjs.org/docs/advanced-features/output-file-tracing

3. **Security**
   - Docker security scanning: `docker scan`
   - Snyk for vulnerability detection
   - OWASP Docker Security

### Practice Exercises

1. **Optimize Build Time**
   - Challenge: Get build time under 2 minutes
   - Techniques: Layer ordering, .dockerignore, build cache

2. **Reduce Image Size**
   - Challenge: Get image under 200MB
   - Techniques: Alpine, standalone mode, multi-stage builds

3. **Add Health Monitoring**
   - Implement comprehensive health checks
   - Add liveness and readiness probes
   - Monitor service dependencies

4. **Security Hardening**
   - Scan for vulnerabilities
   - Implement least privilege principle
   - Add secrets management

---

## 📊 Key Metrics to Monitor

### Image Size Targets
- ✅ Good: < 300MB
- ⚠️ Acceptable: 300-500MB
- ❌ Too large: > 500MB

### Build Time Targets
- ✅ Good: < 3 minutes (with cache)
- ⚠️ Acceptable: 3-5 minutes
- ❌ Too slow: > 5 minutes

### Container Resource Usage
- **CPU**: Should be < 50% under normal load
- **Memory**: Should be < 500MB under normal load
- **Disk I/O**: Monitor with `docker stats`

---

## 🎯 Summary

You've learned:

✅ **Multi-stage builds** for minimal production images  
✅ **Layer caching** for fast rebuilds  
✅ **Security hardening** with non-root users  
✅ **Next.js standalone** for optimal bundle size  
✅ **Docker Compose** for service orchestration  
✅ **Health checks** for reliability  
✅ **Best practices** for production deployments  

**Your frontend is now:**
- 🚀 Production-ready
- 🔒 Security-hardened
- ⚡ Optimized for performance
- 📦 Minimal in size
- 🔄 Easy to deploy

**Next**: Apply these same principles to your 5 backend services!

---

## 📞 Need Help?

If you encounter issues:

1. Check logs: `docker-compose logs -f frontend`
2. Inspect container: `docker exec -it student-helper-frontend sh`
3. Review this guide's troubleshooting section
4. Check Docker documentation
5. Review your DevOps mentor's feedback

Remember: Docker is a tool to make your life easier. If something seems overly complex, there's usually a simpler way!

---

**Happy Dockerizing! 🐳**
