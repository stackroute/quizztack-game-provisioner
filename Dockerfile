FROM mhart/alpine-node-auto
RUN mkdir /gameProvisioner -p
WORKDIR /gameProvisioner
COPY package.json .
RUN npm install --production
COPY . .
CMD ["npm", "start", "--production"]
