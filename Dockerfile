FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && \
    npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN mkdir -p /app/doc

COPY package*.json tsconfig*.json ./
COPY prisma ./prisma/
COPY nest-cli.json ./

RUN apk add --no-cache python3 make g++ && \
    npm ci --only=production && \
    npm install -g @nestjs/cli && \
    npx prisma generate && \
    npm cache clean --force && \
    apk del python3 make g++ && \
    rm -rf /var/cache/apk/* /tmp/* && \
    rm -rf /root/.npm

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]