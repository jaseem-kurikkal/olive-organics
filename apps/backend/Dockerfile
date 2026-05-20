# 1. Base Setup
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
# Install dependencies & generate Prisma client
RUN npm ci
RUN npx prisma generate
COPY . .

# In a true strict production environment, you would run `tsc` here to compile to JS.
# For this setup, we will use `tsx` to run the TypeScript natively in production to avoid compilation overhead for small teams.

# 2. Production Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
