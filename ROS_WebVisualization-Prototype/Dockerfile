FROM node:20.9.0

WORKDIR /EunViZ

RUN npm install -g npm@10.5.2

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY ./websubscriber/package.json .

RUN npm install --legacy-peer-deps

COPY . /EunViZ

WORKDIR /EunViZ/websubscriber

CMD ["npm", "start"]