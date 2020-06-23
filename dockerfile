FROM node:14-alpine

RUN mkdir -p /sl/rest/config
COPY ./restv01/config.json /sl/rest/config/config.json

WORKDIR /work/

COPY ./restv01/package.json /work/package.json
COPY ./restv01/package-lock.json /work/package-lock.json

RUN npm install

COPY ./restv01/ /work/

CMD node .



