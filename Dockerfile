# specify the node version
FROM node:14-alpine

# switches user from root (default)
# to node (the node image has a node user)
USER node

# set the default directory to start in
RUN mkdir /home/node/app
WORKDIR /home/node/app

# copy the dependencies to the docker container
COPY ./package.json ./package-lock.json ./

# install the dependencies
RUN npm install

# copy the project to the docker container
COPY . .
