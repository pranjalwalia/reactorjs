FROM node:14-alpine

# built into the alpine container
USER node

# define workdir
RUN mkdir /home/node/app
WORKDIR /home/node/app

# copy **pinned dependencies** and run install
COPY --chown=node:node yarn.lock package.json ./
RUN yarn install --frozen-lockfile

# copy into container workdir
COPY --chown=node:node . .

# expose -- redundant move
EXPOSE 3000

# start
RUN yarn build:prod

CMD [ "yarn", "prod" ]
