FROM node:16-alpine

EXPOSE 8008

RUN apk add git

RUN npm install pm2 -g

RUN pm2 install pm2-logrotate

WORKDIR /usr/server

COPY package.json .

COPY yarn.lock .

RUN yarn install --ignore-scripts --network-concurrency 1

COPY src src/
COPY pm2.json .

RUN yarn prepare

CMD ["pm2-runtime", "pm2.json"]
