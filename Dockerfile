# Build stage
FROM node:lts AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with legacy peer deps to handle potential conflicts
RUN yarn install --frozen-lockfile --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:lts-slim AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets from build stage
COPY --from=build /app/dist ./build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]