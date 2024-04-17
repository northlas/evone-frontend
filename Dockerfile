FROM node:20-alpine as build

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist/evone-frontend /usr/share/nginx/html