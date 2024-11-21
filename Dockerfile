FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client && \
    npm install -g @nestjs/cli && \
    mkdir -p /app/logs

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && \
    npx prisma generate && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/*

COPY . .

EXPOSE ${PORT}
EXPOSE ${PORT_PRISMA}

CMD ["npm", "run", "start:dev"]