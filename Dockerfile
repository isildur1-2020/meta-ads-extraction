ARG NODE_VERSION=ubuntu:24.04

# FROM ${NODE_VERSION} AS deps-prod
# WORKDIR /app
# COPY ./package.json .
# RUN yarn install --frozen-lockfile

# FROM ${NODE_VERSION} AS builder
# WORKDIR /app
# COPY --from=deps-prod /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# FROM ${NODE_VERSION} AS prod
# ENV APP_ENV=prod
# RUN npx puppeteer browsers install chrome
# WORKDIR /app
# COPY .env .
# COPY tsconfig.json .
# COPY package*.json . 
# COPY --from=builder /app/dist ./dist
# COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["sleep", "10000"]

