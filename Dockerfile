FROM node:18-alpine AS APP_BUILD
ARG NODE_ENV="production"
RUN apk add --no-cache build-base nodejs icu-data-full
WORKDIR /app
COPY ./app .
RUN npm ci --silent
RUN npm run build

FROM node:18-alpine
ARG NODE_ENV="production"
RUN apk add --no-cache build-base nodejs icu-data-full
WORKDIR /server
COPY ./server .
RUN npm ci --silent
COPY --from=APP_BUILD /app/build /server/static
EXPOSE 3000
CMD ["npm", "start"]
