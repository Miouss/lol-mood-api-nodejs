FROM node:18.17.1
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]