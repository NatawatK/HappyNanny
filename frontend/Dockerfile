FROM node:latest as install-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .

FROM install-stage as dev-stage
CMD [ "npm", "run", "serve" ]

FROM install-stage as build-stage
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
