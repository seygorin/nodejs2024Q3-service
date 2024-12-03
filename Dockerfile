FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client && \
    npm install -g @nestjs/cli && \
    mkdir -p /app/logs && \
    chown -R node:node /app/logs && \
    chmod 755 /app/logs

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && \
    npm install @nestjs/passport passport passport-jwt bcrypt @types/passport-jwt @types/bcrypt && \
    npx prisma generate && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/*

COPY . .
RUN chown -R node:node /app

RUN npm run build

EXPOSE ${PORT}
EXPOSE ${PORT_PRISMA}

USER node

CMD ["npm", "run", "start:prod"]