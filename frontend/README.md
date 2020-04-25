# Frontend of HappyNanny

If you run all of these services via `docker-compose`, you can ignore this page. (only for standalone frontend seytup)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Firebase Authentication setup
The firebase authentication is configured in `src/firebaseConfig.js`

If you would like to change firebase config to use your own project
1. Go to [firebase console](https://console.firebase.google.com/)
2. Signin and select thr project
3. Go to project setting
4. Copy config from Firebase SDK snippet part
5. replace it in `src/firebaseConfig.js`