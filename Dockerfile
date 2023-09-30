FROM node:18.17.1-alpine
WORKDIR /lolmood/api
COPY package*.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]