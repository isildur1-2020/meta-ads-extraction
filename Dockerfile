ARG NODE_VERSION=node:20.15.0
ARG DOCKER_IMAGE=ubuntu:24.04

# FROM ${NODE_VERSION} AS deps-prod
# WORKDIR /app
# COPY ./package.json .
# RUN yarn install --frozen-lockfile

# FROM ${NODE_VERSION} AS builder
# WORKDIR /app
# COPY --from=deps-prod /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

FROM ${DOCKER_IMAGE} AS prod
ENV APP_ENV=prod
WORKDIR /app
COPY . .
RUN apt update
RUN apt install -y curl unzip tzdata chromium-browser
ENV TZ_DATA=America/New_York
ENV NVM_DIR=/root/.nvm
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" && \
    nvm install 20.15.0 && npm i
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
# COPY .env .
# COPY tsconfig.json .
# COPY package*.json . 
# COPY --from=builder /app/dist ./dist
# COPY --from=deps-prod /app/node_modules ./node_modules
CMD ["sleep", "10000"]

