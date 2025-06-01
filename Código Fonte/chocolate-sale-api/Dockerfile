
FROM node:18-alpine

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install


COPY . .

EXPOSE ${APP_PORT:-3000}

CMD [ "npm", "run", "dev" ]
