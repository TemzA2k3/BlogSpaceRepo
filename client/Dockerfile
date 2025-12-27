FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app /app

RUN chown -R app:app /app

USER app

EXPOSE 3000

CMD ["npm", "run", "dev"]
