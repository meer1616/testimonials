# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# RUN rm -rf build

# Build the React app
# RUN npm run build

# Install a simple web server
# RUN npm install -g serve

# Serve the React app on port 80
EXPOSE 3000

CMD ["npm", "run", "start"]

# Expose port 80
