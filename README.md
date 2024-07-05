# META ADS EXTRACTION

Verify .env and cookies.json to run
And its the first time also mongo-init.js

### RUN WITH NPM

`npm i`
`npm run start`

### RUN WITH DOCKER

`docker-compose build --no-cache`
`docker-compose up -d`

### LOGS

`docker container logs -f <container_id>`

### UMOUNT DOCKER COMPOSE

`docker-compose down --rmi all`
`docker builder prune -f`
