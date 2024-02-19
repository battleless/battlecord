class WebhookClient {
    constructor(options) {
        if (options.url) {
            if (typeof options.url !== 'string') {
                throw new Error('URL must be a string!');
            } else {
                const array = options.url.replace('https://discord.com/api/webhooks/', '').split('/')

                this.id = array[0]
                this.token = array[1]
            }
        } else if (options.id && options.token) {
            if (typeof options.id !== 'string' || typeof options.token !== 'string') {
                throw new Error('ID and token must be strings!');
            }

            this.id = options.id;
            this.token = options.token;
        }
    }
    async send(options) {
        let body = {};

        if (typeof options === 'string') {
            body = {
                content: options
            }
        } else {
            body = options
        }

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
    async delete(message_id) {
        return fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}/messages/${message_id}`, {
            method: 'DELETE'
        })
            .catch(err => {
                throw new Error(err);
            });
    }
    async edit(message_id, options) {
        let body = {};

        if (typeof options === 'string') {
            body = {
                content: options
            }
        } else {
            body = options
        }

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
    async destroy() {
        return fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}`, {
            method: 'DELETE'
        })
            .then (res => res.json())
            .catch(err => {
                throw new Error(err);
            });
    }
}

module.exports = WebhookClient;