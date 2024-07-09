ARG NODE_VERSION=node:22.3-alpine3.19

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
WORKDIR /app
RUN apk add --no-cache chromium tzdata
ENV TZ=America/Bogota
COPY .env cookies.json tsconfig.json package*.json .
COPY --from=builder /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["npm", "run", "serve"]