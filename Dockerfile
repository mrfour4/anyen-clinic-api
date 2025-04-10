FROM node:22

WORKDIR /app

# Enable Corepack and install specific pnpm version
RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

COPY pnpm-lock.yaml package.json ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm build

CMD ["pnpm", "start:prod"]
