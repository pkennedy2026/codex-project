FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false || npm install --legacy-peer-deps
COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npx nest build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/package.json /app/package-lock.json* ./
RUN npm install --production --legacy-peer-deps
COPY --from=base /app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
