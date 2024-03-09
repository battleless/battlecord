import {
    RestClient
} from '../index.js';

const REST = new RestClient('bot token', {
    version: 10
});

REST.get('/users/@me')
    .then(console.log)
    .catch(console.error);