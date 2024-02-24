const {
    RestClient
} = require('../index.js');

const REST = new RestClient({
    token: 'bot token'
});

REST.get('/users/@me').then(console.log);