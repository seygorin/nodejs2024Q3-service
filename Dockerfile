# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN mkdir -p /app/doc

COPY package*.json tsconfig*.json ./

RUN apk add --no-cache python3 make g++ && \
    npm ci --only=production && \
    npm install -g @nestjs/cli && \
    npm cache clean --force && \
    apk del python3 make g++ && \
    rm -rf /var/cache/apk/* /tmp/* && \
    rm -rf /root/.npm

COPY --from=builder /app/dist ./dist
COPY nest-cli.json ./

EXPOSE 4000

CMD ["node", "dist/main"]