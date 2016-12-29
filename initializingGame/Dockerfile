FROM mhart/alpine-node
RUN mkdir app
WORKDIR app
COPY . .
RUN npm install redis
CMD ["node", "initializeGame.test.js"]