FROM node:16

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy package files first - this helps with caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# The port your server listens on
EXPOSE 5000

# Command to start your server
CMD ["npm", "start"]
