# Build stage
FROM node:lts AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies 
RUN yarn install --frozen-lockfile 

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:lts-slim AS production

WORKDIR /app

# Copy package files for production dependencies
COPY package.json yarn.lock ./

# Install production dependencies
RUN yarn install --frozen-lockfile --production 

# Copy built Next.js application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Start Next.js production server
CMD ["yarn", "start"]