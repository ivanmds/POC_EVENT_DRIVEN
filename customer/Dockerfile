FROM node:14-alpine as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build --prod

ENV LISTEN_PORT=3000
EXPOSE $LISTEN_PORT

CMD [ "npm", "start:prod" ]