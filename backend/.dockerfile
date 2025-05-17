# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies (both regular and dev dependencies)
RUN npm install

# Copy the rest of your application
COPY . .

# Rename prod.env to .env so dotenv picks it up
RUN cp prod.env .env

# Build the app using the build script from package.json
RUN npm run build

# Expose the port that the app will run on
EXPOSE 5432

# Set environment variable for HTTPS in production
ENV NODE_ENV=production

# Command to run the app (production)
CMD ["npm", "run", "serve"]
