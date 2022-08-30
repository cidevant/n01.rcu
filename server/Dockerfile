FROM node:18-alpine
ARG NODE_ENV="development"
RUN apk add --no-cache build-base nodejs icu-data-full
WORKDIR /server
COPY . .
RUN npm ci --silent
EXPOSE 3000
CMD ["npm", "start"]
