FROM node:18

WORKDIR /relatorios

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]