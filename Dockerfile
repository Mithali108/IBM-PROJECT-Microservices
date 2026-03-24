# Main Backend API Gateway Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY api-gateway/package*.json ./api-gateway/

# Install dependencies
RUN npm install
RUN cd api-gateway && npm install && cd ..

# Copy source code
COPY api-gateway ./api-gateway
COPY server.js .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000', (r) => {if (r.statusCode !== 404) throw new Error(r.statusCode)})" || exit 1

# Start the application
CMD ["node", "api-gateway/server.js"]
