####################
# Original
#   URL: https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/dev.Dockerfile
####################

FROM node:17-alpine

# Install make, gcc, g++ and python for command line tool "node-gyp"
RUN apk update && \
    apk upgrade && \
    apk add --no-cache make gcc g++ python3
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Install the Firebase Command Line Interface
RUN npm -g install firebase-tools

COPY . .

CMD npm run dev