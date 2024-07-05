ARG NODE_VERSION=node:20.15.0

FROM ${NODE_VERSION} AS deps-prod
WORKDIR /app
COPY ./package.json .
RUN yarn install --frozen-lockfile

FROM ${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps-prod /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_VERSION} AS prod
ENV APP_ENV=prod
WORKDIR /app
COPY .env cookies.json tsconfig.json package*.json .
COPY --from=builder /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["npm", "run", "serve"]

