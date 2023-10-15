# Green Assets Ranking App

## Installation

```bash
nvm use
```

### Import Data

```bash
cd src/scrape
npm ci

# Start the clickhouse database (user: default)
docker compose up -d

# Import initial data
npm run scrape
```

### Install app

```bash
cd src/ranking-app
npm ci
```

## Start app

```bash
cd src/ranking-app
npm run dev
```
