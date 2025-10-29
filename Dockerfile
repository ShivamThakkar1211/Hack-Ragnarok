# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all app source code
COPY . .

# Expose dev port
EXPOSE 3000

# Run dev server using Turbopack
CMD ["npm", "run", "dev"]
