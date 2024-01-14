From node:latest

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./

RUN yarn

COPY src ./src
COPY visualization ./visualization
COPY favicon.ico ./

ENTRYPOINT ["yarn","ts-node","./src/index.ts"]