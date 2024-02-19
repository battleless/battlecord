const {
    WebhookClient
} = require('../index.js');

const client = new WebhookClient({
    url: 'webhook url'
    // could also seperately supply the id and token
});

client.send('This message will be edited in 5 seconds!').then(message => {
    setTimeout(() => {
        message.edit('This message will be deleted in 5 seconds!').then(message => {
            setTimeout(() => {
                message.delete().then(() => console.log('Message deleted!'));
            }, 5000);
        })
    }, 5000);
});