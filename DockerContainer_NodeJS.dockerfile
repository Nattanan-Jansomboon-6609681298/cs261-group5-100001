FROM node:18 

# Set the working directory inside the containers
WORKDIR /usr/src/app
# Set up environment variables if needed
ENV NODE_ENV=production
# Build Node.js Application
# Step 1: Copy the package.json and package-lock.json (if available)
COPY package*.json ./
# Step 2: Install the Node.js dependencies
RUN npm install --production
# Step 3: Copy the rest of the application code to the container
# Copy the rest of the application code to the working directory
COPY . .
# Expose the port that your Node.js app runs on
EXPOSE 3000
# Step 4: Command to start the Node.js application
CMD ["node", "server.js"]