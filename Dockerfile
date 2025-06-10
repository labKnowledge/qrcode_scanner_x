# Build stage
FROM node:lts AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM node:lts AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./build

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]