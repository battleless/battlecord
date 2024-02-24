const WebSocket = require('ws');

class WebSocketClient {
    constructor(options) {
        if (!options.token) {
            throw new Error('Token is required to connect to the gateway!');
        } else if (typeof options.token !== 'string') {
            throw new Error('Token must be a string!');
        }

        if (options.version && typeof options.version !== 'number') {
            throw new Error('Version must be a number!');
        }

        if (options.intents) {
            if (Array.isArray(options.intents) && options.intents.length > 0) {
                options.intents = options.intents.reduce((acc, val) => acc + val);
            } else if (typeof options.intents === 'number') {
                options.intents = options.intents;
            } else {
                throw new Error('Intents must be a number or an array of numbers!');
            }
        } else {
            this.intents = 0
        }

        this.token = options.token;
        this.version = options.version || 10;
        this.intents = options.intents || 0;

        this.gatewayUrl = `wss://gateway.discord.gg/?v=${this.version}&encoding=json`;
        this.emitHandlers = {};

        this.ws = new WebSocket(this.gatewayUrl);

        this.ws.on('open', () => {
            this.identify();
        });

        this.ws.on('message', data => {
            this.handleMessage(data);
        });
        
        this.ws.on('close', (code, reason) => {
            console.log(`Gateway connection has closed! Reason: ${reason} (${code})`);
            
            process.exit(1);
        });
    }
    async identify() {
        this.send({
            op: 2,
            d: {
                token: this.token,
                intents: this.intents,
                properties: {
                    $os: process.platform
                }
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
            case 10: {
                setInterval(() => {
                    this.send({
                        op: 1,
                        d: null
                    });
                }, 30000);

                break;
            }
        }
    }
    handleDispatch(message) {
        this.emit(message.t, message.d);
    }
    emit(event, data) {
        if (this.emitHandlers[event]) {
            for (const callback of this.emitHandlers[event]) {
                callback(data);
            }
        }
    }
    on(event, callback) {
        if (!this.emitHandlers[event]) {
            this.emitHandlers[event] = [];
        }
    
        this.emitHandlers[event].push(callback);
    }
}

module.exports = WebSocketClient;