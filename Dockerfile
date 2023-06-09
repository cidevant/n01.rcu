FROM node:18-alpine AS APP_BUILD
ENV NODE_ENV="production"
RUN apk add --no-cache build-base nodejs icu-data-full
WORKDIR /app
COPY ./app .
RUN npm ci --silent
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV="production"
ENV PORT=3000
ENV APP_PORT=3001
RUN apk add --no-cache build-base nodejs icu-data-full
WORKDIR /server
COPY ./server .
RUN npm ci --silent
COPY --from=APP_BUILD /app/build /server/app
EXPOSE $PORT
EXPOSE $APP_PORT
CMD ["npm", "start"]
