# Build stage

FROM node:18 as build

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18 as production

COPY --from=build ./build ./build
COPY --from=build ./package.json ./package.json
COPY --from=build ./package-lock.json ./package-lock.json

RUN npm install --only=production

CMD ["npm", "start"]
