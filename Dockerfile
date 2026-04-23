# --- ESTAPA 1: Base (Configuración común y dependencias de sistema) ---
FROM node:22-bookworm-slim AS base

# Instalamos dependencias de sistema necesarias para Prisma y motores de BD
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- ETAPA 2: Deps (Instalación de dependencias de Node) ---
FROM base AS deps
# Copiamos archivos de definición de paquetes
COPY package.json package-lock.json* ./
# Instalamos todas las dependencias
RUN npm install

# --- ETAPA 3: Builder (Compilación de la aplicación) ---
FROM base AS builder
WORKDIR /app
# Traemos las node_modules de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiamos todo el código fuente (incluyendo prisma e init-db)
COPY . .

# Generamos el cliente de Prisma (necesario para el build de Next.js)
RUN npx prisma generate

# Construimos la aplicación en modo standalone
RUN npm run build

# --- ETAPA 4: Runner (Imagen final de producción) ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Creamos un usuario de sistema para no correr como root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiamos archivos públicos
COPY --from=builder /app/public ./public

# Preparamos la carpeta .next con permisos correctos
RUN mkdir .next && chown nextjs:nodejs .next

# Copiamos el build standalone de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# --- ARCHIVOS PARA EL ORQUESTADOR (Aprovisionamiento) ---
# Copiamos la carpeta prisma y el package.json (para que npx funcione)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copiamos los scripts SQL de inicialización directamente al runner
# Esto evita errores si el builder tuvo problemas con las rutas
COPY --chown=nextjs:nodejs init-db ./init-db

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js es generado por el modo standalone de Next.js
CMD ["node", "server.js"]