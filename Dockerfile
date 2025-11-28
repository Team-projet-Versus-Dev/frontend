# docker/frontend.Dockerfile
###################################
# build stage
###################################
FROM node:20-alpine AS build
WORKDIR /app

# Contexte = frontend/, donc package*.json sont ici
COPY package*.json ./
RUN npm ci

# On copie tout le code du frontend
COPY . .
RUN npm run build

###################################
# production (serve)
###################################
FROM node:20-alpine AS runner
WORKDIR /app

# On utilise 'serve' pour servir le build Vite
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
