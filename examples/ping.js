const {
    WebSocketClient,
    RestClient, 
    Events,
    Intents
} = require('../index.js');

const token = 'bot token';

const ws = new WebSocketClient({
    token: token,
    intents: [Intents.GuildMessages, Intents.MessageContent]
});

const REST = new RestClient({
    token: token
});

ws.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    
    if (message.content === '!ping') {
        REST.post(`/channels/${message.channel_id}/messages`, {
            content: 'Pong!',
            message_reference: {
                message_id: message.id,
                guild_id: message.guild_id,
                fail_if_not_exists: true
            }
        }).catch(console.error);
    }
});