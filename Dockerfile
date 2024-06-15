FROM node:22.3-alpine3.19 AS dev
WORKDIR /app
COPY ./package.json .
RUN yarn install --frozen-lockfile
CMD ["npm", "run", "dev"]

FROM node:22.3-alpine3.19 AS deps-prod
WORKDIR /app
COPY ./package.json .
RUN yarn install --frozen-lockfile

FROM node:22.3-alpine3.19 AS builder
WORKDIR /app
COPY --from=deps-prod /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.3-alpine3.19 AS prod
WORKDIR /app
COPY .env .
COPY tsconfig.json .
COPY package*.json . 
COPY --from=builder /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["npm", "run", "serve"]

