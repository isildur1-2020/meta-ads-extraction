ARG DOCKER_IMAGE=ubuntu:24.04

# FROM ${DOCKER_IMAGE} AS deps-prod
# WORKDIR /app
# COPY ./package.json .
# RUN yarn install --frozen-lockfile

# FROM ${DOCKER_IMAGE} AS builder
# WORKDIR /app
# COPY --from=deps-prod /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

FROM ${DOCKER_IMAGE} AS prod
RUN apt update
RUN apt install -y curl unzip
RUN export NVM_DIR="$HOME/.nvm"
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
RUN [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
# ENV APP_ENV=prod
# RUN npx puppeteer browsers install chrome
# WORKDIR /app
# COPY .env .
# COPY tsconfig.json .
# COPY package*.json . 
# COPY --from=builder /app/dist ./dist
# COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["sleep", "10000"]

