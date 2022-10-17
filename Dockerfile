FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV MODE=PRODUCTION

RUN npm run run-migration

CMD [ "node", "dist/main.js" ]