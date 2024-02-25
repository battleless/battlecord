class RestClient {
    /**
     * @param {string} options.token - The token to authenticate with the Discord API
     * @param {number} options.version - The version of the Discord API to use, default is 10
     * @example
     * const RestClient = require('./index.js');
     * 
     * const REST = new RestClient({
     *     token: 'token here'
     * });
     */
    constructor({ token, version = 10 }) {
        this.token = token;
        this.version = version;
    }
    /**
     * @param {string} path 
     * @param {object} options 
     * @returns Promise<Object>
     */
    async fetch(path, options) {
        options.headers = {
            'Authorization': `Bot ${this.token}`,
            'Content-Type': 'application/json'
        }

        return fetch('https://discord.com/api/v' + this.version + path, options)
            .then (res => {
                if (options.method.toLowerCase() !== 'delete') {
                    return res.json();
                }
            })
            .catch(err => {
                throw new Error(err);
            });
    }
    /**
     * Send a GET request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @returns Promise<Object>
     */
    async get(path) {
        return this.fetch(path, {
            method: 'GET'
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
            body: JSON.stringify(body)
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
            body: JSON.stringify(body)
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
            body: JSON.stringify(body)
        });
    }
    /**
     * Send a DELETE request to the Discord API
     * @param {string} path Path to the Discord API endpoint
     * @returns Promise<Object>
     */
    async delete(path) {
        return this.fetch(path, {
            method: 'DELETE'
        });
    }
}

module.exports = RestClient;