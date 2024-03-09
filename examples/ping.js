import {
    WebSocketClient,    
    Events,
    Intents
} from '../index.js';

const ws = new WebSocketClient({
    intents: [
        Intents.GuildMessages,
        Intents.MessageContent
    ]
});

ws.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    
    if (message.content.toLowerCase() === '!ping') {
        ws.rest.post(`/channels/${message.channel_id}/messages`, {
            content: 'Pong!',
            message_reference: {
                message_id: message.id,
                guild_id: message.guild_id,
                fail_if_not_exists: true
            }
        });
    }
});

ws.connect('bot token');