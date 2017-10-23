const WebSocket = require('ws');

export default class CertStreamClient{
    constructor(callback, skipHeartbeats = false) {
        this.context = {};
        this.callback = callback;
        this.skipHeartbeats = skipHeartbeats;
    }

    connect(){
        this.ws = new WebSocket("wss://certstream.calidog.io/");

        this.ws.on('open', () => {
            console.log("Connection established to certstream! Waiting for messages...");
        });

        this.ws.on('message', (message) => {
            let parsedMessage = JSON.parse(message);

            if (parsedMessage.message_type === "heartbeat" && this.skipHeartbeats) {
                return;
            }

            this.callback(parsedMessage, this.context);
        });
    }
};
