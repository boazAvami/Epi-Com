FROM node:18-slim

WORKDIR /app/backend

# Copy only package.json & tsconfig files first for caching
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./

# Copy source code
COPY backend/src ./src

# Copy shared package
COPY packages/types ../../packages/types

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Expose port your app listens on (replace if not 5432)
EXPOSE 5432

ENV NODE_ENV=production

CMD ["npm", "run", "serve"]
