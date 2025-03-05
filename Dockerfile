FROM node:20.12.1

WORKDIR /app

COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["node", "dist/app.js"]
