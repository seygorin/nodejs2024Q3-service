FROM node:18-alpine AS builder

WORKDIR /app

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

RUN npm ci --omit=production && \
    npm i -g @nestjs/cli && \
    npx prisma generate && \
    npm cache clean --force && \
    rm -rf /root/.npm

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && nest start --watch"]