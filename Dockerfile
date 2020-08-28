FROM node:12.18.2

ADD ./ /cms

WORKDIR /cms

# generate db types
RUN npm run db:gen

# build application
RUN npm run build

CMD ["npm", "start"]
