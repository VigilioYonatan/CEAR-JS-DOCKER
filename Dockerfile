# ---------- Base Image ----------
  FROM node:22.16.0-alpine AS base
  WORKDIR /usr/src/app
  
  # ---------- Dependencies ----------
  FROM base AS dependencies
  COPY /package*.json ./
  RUN npm install
  
  # ---------- Development ----------
  FROM base AS development
  WORKDIR /usr/src/app
  COPY . .
  COPY --from=dependencies /usr/src/app/node_modules ./node_modules
  
  # Default command for development
  CMD ["npm", "run", "server"]
  
  # ---------- Build ----------
  FROM base AS build
  WORKDIR /usr/src/app
  COPY . .
  COPY --from=dependencies /usr/src/app/node_modules ./node_modules
  
  # Build steps
  RUN npm run biome:format && \
      npm run biome:check && \
      npm run build:serve && \
      npm run build:dev && \
      rm -rf node_modules && \
      npm install --production && \
      npm install --platform=linux --arch=x64 sharp
  
  # ---------- Production ----------
  FROM node:22.16.0-alpine AS production
  WORKDIR /usr/src/app
  
  # Crear usuario y grupo no-root
  RUN addgroup -g 1001 -S nodejs && \
      adduser -S cearjs -u 1001
  
  # Copiar archivos y cambiar permisos
  COPY . .
  COPY --from=build /usr/src/app/node_modules ./node_modules
  COPY --from=build /usr/src/app/dist ./dist
  
  # Asignar permisos al usuario
  RUN chown -R nextjs:nodejs /usr/src/app
  
  # Cambiar al usuario no-root
  USER nextjs
  
  # Ejecutar servidor en producción
  CMD ["node", "dist/main.js"]
  