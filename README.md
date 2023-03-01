# Chronos

## Setup enveronment dependencies
1. Go to Google Cloud setting up OAuth 2.0. [[ref]](https://support.google.com/cloud/answer/6158849?hl=en)
  - Add `https://www.googleapis.com/auth/calendar.readonly` to scope when you setup consent screen.
2. Clone `.env.sample` and rename to `.env`.
3. Fill `GOOGLE_API_CLIENT_ID` and `API_KEY` from step 1.

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
