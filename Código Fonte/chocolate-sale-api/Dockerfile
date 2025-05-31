# Dockerfile (for chocolate-sales-api)
FROM node:18-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

COPY . .

EXPOSE ${APP_PORT:-3000}

CMD [ "npm", "run", "dev" ]
# For production, you might use: CMD [ "npm", "start" ]