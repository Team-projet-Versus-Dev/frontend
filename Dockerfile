###################################
# build stage
###################################
FROM node:20-alpine AS build
WORKDIR /app

# 1) Installer les dépendances
COPY package*.json ./
RUN npm install

# 2) Copier le reste du code
COPY . .

# 3) Build de l'app (Vite)
RUN npm run build

###################################
# production stage
###################################
FROM node:20-alpine AS runner
WORKDIR /app

# on utilise 'serve' pour servir le build statique
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]