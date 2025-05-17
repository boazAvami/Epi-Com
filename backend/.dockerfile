FROM node:18-slim

WORKDIR /app

# Copy backend code
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/src ./src

# Copy shared package (used by @shared/types)
COPY packages/types ../packages/types

# Install deps
RUN npm install

# Build the app
RUN npm run build

EXPOSE 5432

ENV NODE_ENV=production

CMD ["npm", "run", "serve"]
