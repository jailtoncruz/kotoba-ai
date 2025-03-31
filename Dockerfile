FROM node:22-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY . .

RUN pnpm install
RUN pnpm build

# Expose the port that the application will run on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]