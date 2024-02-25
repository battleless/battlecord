const WebSocket = require('ws');

const {
    EventEmitter
} = require('node:events');

class WebSocketClient extends EventEmitter {
    constructor({ token, version = 10, intents = 0, presence = {}, cacheOptions = {} }) {
        super();

        this.token = token;
        this.version = version;
        this.intents = Array.isArray(intents) ? intents.reduce((a, b) => a + b) : intents;
        this.presence = presence;

        this.cacheOptions = cacheOptions;

        this.cache = {};
        this.cache.guilds = new Map();
        this.cache.messages = new Map();

        this.session =  null;

        this.gatewayUrl = `wss://gateway.discord.gg/?v=${this.version}&encoding=json`;

        this.ws = new WebSocket(this.gatewayUrl);

        this.ws.once('open', () => {
            this.identify();
        });

        this.ws.on('message', data => {
            this.handleMessage(data);
        });

        this.ws.on('error', error => {
            throw new Error(error);
        });

        this.ws.once('close', (code, reason) => {
            throw new Error(`WebSocket closed: ${reason ? `${reason} (${code})` : code}`);
        });
    }
    async identify() {
        await this.send({
            op: 2,
            d: {
                token: this.token,
                intents: this.intents,
                properties: {
                    $os: process.platform
                },
                presence: this.presence
            }
        });
    }
    async send(data) {
        this.ws.send(JSON.stringify(data));
    }
    async handleMessage(data) {
        const message = JSON.parse(data);

        switch (message.op) {
            case 0: {
                this.handleDispatch(message);
                
                break;
            }
            case 9: {
                throw new Error('Invalid session!');
            }
            case 10: {
                this.heartbeatInterval = setInterval(async () => {
                    await this.send({
                        op: 1,
                        d: null
                    });
                }, 30000);

                break;
            }
        }
    }
    handleDispatch(message) {
        const {
            t,
            d
        } = message;

        this.emit(t, d);

        switch (t) {
            case 'READY': {
                this.session = d;
                
                break;
            }
            case 'MESSAGE_CREATE':
            case 'MESSAGE_UPDATE':
            case 'MESSAGE_DELETE': {
                if (this.cacheOptions.messages) {
                    this.cache.messages[t === 'MESSAGE_DELETE' ? 'delete' : 'set'](d.id, d);
                }

                break;
            }
            case 'GUILD_CREATE':
            case 'GUILD_UPDATE':
            case 'GUILD_DELETE': {
                if (this.cacheOptions.guilds) {
                    this.cache.guilds[t === 'GUILD_DELETE' ? 'delete' : 'set'](d.id, d);
                }

                break;
            }
        }
    }
}

module.exports = WebSocketClient;