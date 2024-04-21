# Green Assets Ranking App

## Import Data

```bash
# Start the clickhouse database (user: default)
docker compose up -d
```

```bash
nvm use
cd src/import
npm ci
# Import initial data
npm run import
```

## Install and start app

```bash
nvm use
cd src/ranking-app
npm ci
```

And then start the app:

```bash
npm run dev
```

![ScreenShot](screenshot.png)

![ScreenShot 2](screenshot_2.png)
