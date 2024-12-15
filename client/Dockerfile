FROM node:16

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy package files first - this helps with caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# The port your React app runs on
EXPOSE 3000

# Command to start your app
CMD ["npm", "start"]
