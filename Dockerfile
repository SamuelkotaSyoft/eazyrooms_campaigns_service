FROM node:18

WORKDIR /usr/src/eazyrooms_campaigns_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3006

CMD ["node", "server.js"]