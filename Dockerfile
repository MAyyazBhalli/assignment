# stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# stage 2
FROM nginx:Alpine
COPY --from=mode /app/dist/sakai-ng /usr/share/nginx/html