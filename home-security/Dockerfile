FROM node:16.14.2-bullseye

RUN mkdir /app

WORKDIR /app

COPY public/ /app/public
COPY src/ /app/src
COPY devextreme.json package.json /app/

RUN npm install
EXPOSE 3000

CMD ["npm","start","/app/src/App.js"]