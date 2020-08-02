FROM node:alpine as base

WORKDIR /app

COPY package*.json ./app/

RUN npm install --silent

EXPOSE 3000
# Dev environment doesn't run the following steps

FROM base as builder

WORKDIR /app

COPY . .

RUN npm run build

RUN npm install -g serve

FROM node:alpine

COPY --from=builder /app/build ./build

EXPOSE 5000

CMD ["serve", "-p", "5000", "-s", "./build"]