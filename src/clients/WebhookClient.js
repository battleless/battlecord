class WebhookClient {
    /**
     * 
     * @param {string} url The URL of the webhook   
     * @param {string} id The ID of the webhook
     * @param {string} token The token of the webhook
     * @example
     * import {
     *    WebhookClient
     * } = from './index.js';
     * 
     * const client = new WebhookClient({
     *    url: 'webhook url'
     *   // could also seperately supply the id and token
     * });
     */
    constructor({ url, id, token }) {
        if (url) {
            const array = url.replace('https://discord.com/api/webhooks/', '').split('/');

            this.url = url;
            this.id = array[0];
            this.token = array[1];
        } else if (id && token) {
            this.url = `https://discord.com/api/webhooks/${id}/${token}`;
            this.id = id;
            this.token = token;
        } else {
            throw new Error('You must supply either a webhook URL or an ID and token!');
        }
    }
    /** 
     * 
     * @param {string|object} options The options to send the message with
     * @returns {Promise<object>}
     * @example
     * client.send('Hello, world!').then(message => {
     *    console.log(message.data);
     * });
    */
    async send(options) {
        const body = typeof options === 'string' ? { content: options } : options;

        return fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}?wait=true`, {
            method: 'POST',
            headers: {
                'Content-Type': options.attachments ? 'multipart/form-data' : 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then (res => res.json())
            .then(json => {
                return {
                    data: json,
                    delete: async () => {
                        return this.delete(json.id);
                    },
                    edit: async (options) => {
                        return this.edit(json.id, options);
                    }
                }
            })
            .catch(err => {
                throw new Error(err);
            });;
    }
    /**
     * 
     * @param {string} message_id The message ID to delete
     * @returns {Promise<void>}
     * @example
     * client.delete('1234567890').then(() => console.log('Message deleted!'));
     */
    async delete(message_id) {
        return fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}/messages/${message_id}`, {
            method: 'DELETE'
        })
            .catch(err => {
                throw new Error(err);
            });
    }
    /**
     * 
     * @param {string} message_id The message ID to edit
     * @param {string|object} options The options to edit the message with
     * @returns {Promise<object>}
     * @example
     * client.edit('1234567890', 'Hello, world!').then(message => {
     *   console.log(message.data);
     * });
     */
    async edit(message_id, options) {
        const body = typeof options === 'string' ? { content: options } : options;

        return fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}/messages/${message_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': options.attachments ? 'multipart/form-data' : 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then (res => res.json())
            .then(json => {
                return {
                    data: json,
                    delete: async () => {
                        return this.delete(json.id);
                    },
                    edit: async (options) => {
                        return this.edit(json.id, options);
                    }
                }
            })
            .catch(err => {
                throw new Error(err);
            });
    }
    /**
     * Deletes the webhook
     * @returns {Promise<void>}
     */
    async destroy() {
        return fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}`, {
            method: 'DELETE'
        })
            .catch(err => {
                throw new Error(err);
            });
    }
}

export default WebhookClient;