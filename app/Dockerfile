FROM node:18-alpine
RUN apk add --no-cache build-base nodejs icu-data-full
ENV NODE_ENV="development"
ENV BROWSER="none"
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
WORKDIR /app
COPY . .
RUN npm ci --silent
CMD ["npm", "start"]
