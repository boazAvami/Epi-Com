FROM node:18-slim

WORKDIR /app

# Copy backend code and configs
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/src ./src

# Copy shared package (used by @shared/types)
COPY packages/types ../packages/types

# Copy prod.env to .env
COPY backend/prod.env .env

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Expose your port
EXPOSE 5432

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the app
CMD ["npm", "run", "serve"]
