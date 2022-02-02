FROM node:14-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g @nestjs/cli
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --production

FROM node:14-alpine

RUN apk --no-cache add curl
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV LISTEN_PORT=3000
EXPOSE $LISTEN_PORT

COPY --from=builder /usr/src/app/.env* ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD [ "node", "dist/main" ]