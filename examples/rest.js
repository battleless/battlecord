const {
    RestClient
} = require('../index.js');

const REST = new RestClient({
    token: 'bot token',
    version: 10
});

REST.get('/users/@me').then(console.log);