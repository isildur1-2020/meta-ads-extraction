ARG NODE_VERSION=node:20.15.0
ARG DOCKER_IMAGE=ubuntu:24.04

FROM ${NODE_VERSION} AS deps-prod
WORKDIR /app
COPY ./package.json .
RUN yarn install --frozen-lockfile

FROM ${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps-prod /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${DOCKER_IMAGE} AS prod
RUN apt update
RUN apt install -y curl unzip
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" && \
    nvm install 20.15.0
ENV APP_ENV=prod
# RUN npx puppeteer browsers install chrome
WORKDIR /app
COPY .env .
COPY tsconfig.json .
COPY package*.json . 
COPY --from=builder /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["sleep", "10000"]

