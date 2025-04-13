# Use the official Node.js image
FROM node:20-alpine

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["npm", "run", "prod"]
