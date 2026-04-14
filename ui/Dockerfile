# Use official Node.js image as base
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci --silent

# Copy the rest of the application source code
COPY . .

# Build the Vite app (optional, for production)
# RUN npm run build

# Expose the development server port (default Vite dev server port 5173)
EXPOSE 5173

# Set environment variable for Vite to listen on all interfaces
ENV HOST=0.0.0.0

# Start the development server
CMD ["npm", "run", "dev"]
