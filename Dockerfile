FROM node:14-alpine

WORKDIR /usr/src/server

COPY package.json /usr/src/server
COPY yarn.lock /usr/src/server

RUN yarn

COPY . /usr/src/server

RUN yarn build

ENV NODE_ENV production
ENV PORT 4000

EXPOSE 4000

CMD ["node", "dist/index.js"]

USER node
