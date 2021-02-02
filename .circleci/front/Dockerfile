# Maybe we don't need any stages and build
# FROM keymetrics/pm2:12-alpine

FROM keymetrics/pm2:latest-alpine

WORKDIR /app

# Bundle APP files
COPY /src src/
COPY /public public/
COPY /package*.json /app/
COPY /.circleci/front/pm2.* /app/

# Install app dependencies
RUN npm install --production
RUN npm install react-scripts@3.4.1 -g 
RUN echo 'Europe/Moscow' > /etc/timezone

EXPOSE 3000

CMD [ "pm2-runtime", "start", "pm2.json" ]
