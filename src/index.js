const WebSocket = require('ws');

export default class CertStreamClient{
    constructor(callback, skipHeartbeats = false, pingSeconds = 10) {
        this.context = {};
        this.callback = callback;
        this.skipHeartbeats = skipHeartbeats;
        this.pingSeconds = pingSeconds;
    }

    connect(url="wss://certstream.calidog.io/"){
        console.log(`Connecting to ${url}...`);
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log("Connection established to certstream! Waiting for messages...");

            this.pingInterval = setInterval(this.ws.ping.bind(this.ws), this.pingSeconds * 1000);
        });

        this.ws.on('message', (message) => {
            let parsedMessage = JSON.parse(message);

            if (parsedMessage.message_type === "heartbeat" && this.skipHeartbeats) {
                return;
            }

            this.callback(parsedMessage, this.context);
        });

        this.ws.on('close', () => {
            clearInterval(this.pingInterval);
        });
    }
};
