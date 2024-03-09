import {
    WebSocketClient,
    Events
} from '../index.js';

const ws = new WebSocketClient();

ws.on(Events.Ready, () => {
    console.log('WebSocket is ready!');
});

ws.connect('bot token');