FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates default-mysql-client && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# --- EL CAMBIO CLAVE ---
# Le damos un HOME real al usuario para que npx pueda trabajar
ENV HOME=/home/nextjs

# Instalamos prisma globalmente primero (como root) para que los binarios queden disponibles
RUN npm install -g prisma@6.8.2

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nextjs nextjs && \
    mkdir -p /home/nextjs/.npm && \
    chown -R nextjs:nodejs /home/nextjs /app

# Copiamos lo necesario de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public


# 1. Traemos el SCOPE completo de @prisma (motores, cliente, debug)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# 2. EL FIX: Copiamos el paquete prisma principal (donde residen los archivos .wasm reales)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# 3. Opcional: Copiamos .bin por si algún script lo necesita internamente
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

# 3. Tus esquemas, scripts y package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --chown=nextjs:nodejs init-db ./init-db

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]