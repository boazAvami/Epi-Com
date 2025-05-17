# Start from Node
FROM node:18-slim

WORKDIR /app

# Copy backend code and types
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/src ./src
COPY packages/types ./packages/types

# Install dependencies
RUN npm install

# Build
RUN npm run build

EXPOSE 5432

ENV NODE_ENV=production

CMD ["npm", "run", "serve"]
