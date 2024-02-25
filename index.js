const RestClient = require('./src/clients/RestClient.js');
const WebhookClient = require('./src/clients/WebhookClient.js');
const WebSocketClient = require('./src/clients/WebSocketClient.js');

const ActivityTypes = require('./src/enums/ActivityTypes.js');
const Intents = require('./src/enums/Intents.js');
const Events = require('./src/enums/Events.js');

module.exports = {
    RestClient,
    WebhookClient,
    WebSocketClient,
    ActivityTypes,
    Intents,
    Events
}