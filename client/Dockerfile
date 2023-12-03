# Backend Dockerfile
FROM node:latest
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["node", "server.js"]