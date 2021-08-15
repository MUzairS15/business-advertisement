FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install

CMD ["nodemon" , "index.js"]