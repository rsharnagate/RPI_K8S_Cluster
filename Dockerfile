FROM arm32v7/node:lts-alpine3.9

ENV PORT 8081
ENV NODE_ENV 'prod'

RUN mkdir -p /sl/rest/config
COPY ./restv01/config.json /sl/rest/config/config.json

WORKDIR /work/

COPY ./restv01/package.json /work/package.json
COPY ./restv01/package-lock.json /work/package-lock.json

RUN npm install

COPY ./restv01/ /work/

EXPOSE ${PORT}

CMD node .