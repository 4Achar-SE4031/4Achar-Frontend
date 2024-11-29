# Step 1: Build the React app using Vite
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite project (the output will go to /app/dist)
RUN npm run build

# Step 2: Set up Nginx to serve the built app
FROM nginx:alpine

# Copy the built files from the 'build' stage into Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration (ensure nginx.conf exists in your project root)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx in the foreground (necessary for Docker containers)
CMD ["nginx", "-g", "daemon off;"]
