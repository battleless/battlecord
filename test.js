const { RestClient } = require('./index.js');

const REST = new RestClient({
    token: '',
    version: 10
});

REST.get('/users/@me').then(res => res.json()).then(console.log);