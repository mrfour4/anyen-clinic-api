FROM node:22

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

COPY pnpm-lock.yaml package.json ./

# Enable script execution and install dependencies
RUN pnpm config set ignore-scripts false && pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm build

CMD ["pnpm", "start:prod"]
