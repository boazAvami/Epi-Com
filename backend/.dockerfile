FROM node:18-slim

WORKDIR /app

# Copy backend code and configs
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/src ./src

# Copy shared package (used by @shared/types)
COPY packages/types ../packages/types

# Copy certs into the image!
COPY backend/certs ./certs

# Copy prod.env to .env
COPY backend/.envprod .env

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Expose your port
EXPOSE 8082

# Set NODE_ENV to production
ENV NODE_ENV=production

# Ensure app starts from the right dir
WORKDIR /app/dist/app/src

# Start the app
CMD ["npm", "run", "serve"]


#docker build -t epi-backend -f ./backend/.dockerfile .
#docker run --name epi-backend -p 8082:8082 -d epi-backend
#docker logs -f epi-backend