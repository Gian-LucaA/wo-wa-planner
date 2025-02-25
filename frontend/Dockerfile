# Stage-1 & specify a name 'builder'
FROM node:latest AS builder

# Create a directory and go to the directory 
WORKDIR /wowaplanner

# Copy the package.json and package-lock.json files to install the necessary dependencies  
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Set the environment variable to fix the OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy other files to my current directory
COPY . .

# Build the Next.js application
RUN npm run build

# Stage-2
FROM node:latest AS runner

# Set working directory
WORKDIR /wowaplanner

# Copy the built files from the builder stage
COPY --from=builder /wowaplanner ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]