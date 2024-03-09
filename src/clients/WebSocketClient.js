import WebSocket from 'ws';

import {
    EventEmitter
} from 'node:events';

import RestClient from './RestClient.js';

class WebSocketClient extends EventEmitter {
    constructor({ version = 10, intents = 0, presence = {}, cacheOptions = {} }) {
        super();

        this.version = version;
        this.intents = Array.isArray(intents) ? intents.reduce((a, b) => a + b) : intents;
        this.presence = presence;

        this.cacheOptions = cacheOptions;

        this.cache = {};
        this.cache.guilds = new Map();
        this.cache.messages = new Map();

        this.gatewayUrl = `wss://gateway.discord.gg/?v=${this.version}&encoding=json`;
    }
    async identify() {
        this.send({
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
    async connect(token) {
        this.rest = new RestClient(token, {
            version: this.version
        });

        await this.rest.get('/users/@me')
            .then(res => {
                if (res?.message) {
                    throw new Error(res.message);
                }

                this.token = token;
                this.user = res;
            });

        this.ws = new WebSocket(this.gatewayUrl);

        this.ws.once('open', () => {
            this.identify();
        });

        this.ws.on('message', data => {
            this.handleMessage(data);
        });

        this.ws.on('error', error => {
            throw new Error(`WebSocket error: ${error.message}`)
        });

        this.ws.once('close', (code, reason) => {
            throw new Error(`WebSocket closed: ${reason.toString() || code}`);
        });
    }
    async send(data) {
        this.ws.send(JSON.stringify(data));
    }
    handleMessage(data) {
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
                this.heartbeatInterval = setInterval(() => {
                    this.send({
                        op: 1,
                        d: null
                    });
                }, message.d.heartbeat_interval);

                break;
            }
        }
    }
    handleDispatch(message) {
        const {
            t,
            d
        } = message;

        if (t === 'GUILD_CREATE' && this.cacheOptions.guilds) {
            const guild = this.cache.guilds.get(d.id);

            if (!guild || guild.available) {
                this.emit(t, d);
            }
        } else {
            this.emit(t, d);
        }

        switch (t) {
            case 'READY': {
                this.session = d;

                if (this.cacheOptions.guilds) {
                    for (const guild of d.guilds) {
                        this.cache.guilds.set(guild.id, guild);
                    }
                }
                
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

export default WebSocketClient;