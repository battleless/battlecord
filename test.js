const { RestClient } = require('./index.js');
const config = require('./config.json');

const REST = new RestClient({
    token: config.token,
    version: 10
});

REST.get('/users/@me').then(res => res.json()).then(console.log);