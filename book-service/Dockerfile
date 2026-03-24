FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5002', (r) => {if (r.statusCode !== 404) throw new Error(r.statusCode)})" || exit 1

CMD ["npm", "start"]
