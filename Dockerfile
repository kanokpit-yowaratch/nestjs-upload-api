FROM node:18

# Create app-mysql-upload directory
RUN mkdir -p /usr/src/app-mysql-upload
WORKDIR /usr/src/app-mysql-upload

# Install app-mysql-upload dependencies
COPY package*.json /usr/src/app-mysql-upload/
RUN npm install

# Bundle app-mysql-upload source
COPY . /usr/src/app-mysql-upload

RUN npm run build

EXPOSE 5000
RUN chown -R node /usr/src/app-mysql-upload
CMD [ "npm", "start" ]