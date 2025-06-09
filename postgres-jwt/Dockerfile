ARG NODE_VERSION=20


FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

RUN npx prisma generate --schema prisma/schema.prisma

USER root

RUN mkdir -p /usr/src/app/logs && chmod -R 777 /usr/src/app/logs

EXPOSE 4001

CMD [ "npm", "run", "start" ]