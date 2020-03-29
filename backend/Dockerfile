FROM node:10 as install-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .

FROM install-stage as dev-stage
CMD ["npm", "run" ,"dev"]

FROM install-stage as build-stage
RUN npm run compile

FROM build-stage as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
CMD [ "node", "./dist/server.js"]
