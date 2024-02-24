const {
    WebSocketClient,
    Events
} = require('../index.js');

const ws = new WebSocketClient({
    token: 'bot token'
});

ws.on(Events.Ready, () => {
    console.log('WebSocket is ready!');
});