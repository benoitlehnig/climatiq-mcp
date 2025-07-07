# Dockerfile for Hugging Face Spaces with TypeScript MCP
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY web-server.ts ./

# Install additional dependencies for web interface
RUN npm install express cors dotenv @types/express @types/cors

# Build TypeScript
RUN npm run build

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port 7860 (required by Hugging Face)
EXPOSE 7860

# Environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:7860/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the web server (not the MCP server)
CMD ["npm", "run", "start:web"]