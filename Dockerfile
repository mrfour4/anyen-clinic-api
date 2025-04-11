FROM node:22

WORKDIR /app

# Enable Corepack and install specific pnpm version
RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Allow scripts to run (disable safety restrictions)
RUN pnpm config set enable-pre-post-scripts true && \
    pnpm config set ignore-scripts false && \
    pnpm install

# Copy app source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the app
RUN pnpm build

# Start production server
CMD ["pnpm", "start:prod"]
