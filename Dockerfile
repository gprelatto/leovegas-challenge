FROM node:18-alpine

COPY src ./src
COPY config ./config
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY ormconfig.ts ./
COPY datasource.config.ts ./
COPY typeorm.object.ts ./
COPY leovegas.sqlite ./

RUN npm ci; npm run build;

CMD ["npm", "run", "start:prod"]
