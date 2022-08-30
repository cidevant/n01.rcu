FROM node:18-alpine
RUN apk add --no-cache build-base nodejs icu-data-full
ENV NODE_ENV="development"
ENV BROWSER="none"
ENV PORT=7001
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
WORKDIR /app
COPY . .
RUN npm ci --silent
EXPOSE 7001
CMD ["npm", "start"]
