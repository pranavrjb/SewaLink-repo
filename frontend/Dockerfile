# Build stage
FROM node:20-alpine AS build-frontend
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM alpine AS artifact
WORKDIR /dist
COPY --from=build /app/dist .
