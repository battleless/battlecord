class RestClient {
    /**
     * @param {string} options.token - The token to use for the client.
     * @param {boolean} options.validiateToken - Whether or not to validiate the token.
     * @param {number} options.version - The version of the Discord API to use.
     * @example
     * const RestClient = require('battlecord');
     * const REST = new RestClient({
     *     token: '...'
     * });
     */
    constructor(options) {
        if (!options.token) throw new Error('RestClient requires a token!');
        if (typeof options.token !== 'string') throw new Error('Token must be a string!');
        if (options.validiateToken && typeof options.validiateToken !== 'boolean') throw new Error('ValidiateToken must be a boolean!');

        this.version = options.version.toString() || '10';

        if (options.validiateToken) {
            fetch(`https://discord.com/api/v${this.version}/users/@me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${options.token}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 401) throw new Error(`Token could not be validated!`);
            });
        }

        this.token = options.token;
    }
    /**
     * @param {string} path 
     * @param {object} options 
     * @returns Promise<Object>
     */
    async fetch(path, options) {
        return fetch('https://discord.com/api/v' + this.version + path, options);
    }
    /**
     * Send a GET request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @returns Promise<Object>
     */
    async get(path) {
        return this.fetch(path, {
            method: 'GET',
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
        .catch(err => {
            throw new Error(err);
        });
    }
    /**
     * Send a POST request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @param {object} body Body to send to the Discord API
     * @returns Promise<Object>
     */
    async post(path, body) {
        return this.fetch(path, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).catch(err => {
            throw new Error(err);
        });
    }
    /**
     * Send a PATCH request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @param {object} body Body to send to the Discord API
     * @returns Promise<Object>
     */
    async patch(path, body) {
        return this.fetch(path, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).catch(err => {
            throw new Error(err);
        });
    }
    /**
     * Send a PUT request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @param {object} body Body to send to the Discord API
     * @returns Promise<Object>
     */
    async put(path, body) {
        return this.fetch(path, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).catch(err => {
            throw new Error(err);
        });
    }
    /**
     * Send a DELETE request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @returns Promise<Object>
     */
    async delete(path) {
        return this.fetch(path, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            throw new Error(err);
        });
    }
}

module.exports = RestClient;