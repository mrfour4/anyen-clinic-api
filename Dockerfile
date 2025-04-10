
FROM node:20

WORKDIR /app

RUN curl -fsSL https://get.pnpm.io/install.sh | sh - && \
    ln -s /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm build

CMD ["pnpm", "start:prod"]
