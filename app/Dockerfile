FROM node:18-alpine
ARG NODE_ENV="development"
RUN apk add --no-cache build-base nodejs icu-data-full
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
EXPOSE 7001
CMD ["npm", "start"]
