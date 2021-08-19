FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine 
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/build /usr/src/app/build
CMD ["npm", "run", "start"]