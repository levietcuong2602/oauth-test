FROM node:16.14.2
WORKDIR /app
COPY package.json .
RUN npm i
CMD ["npm", "run", "authServer"]


