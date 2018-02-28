const WebSocketClient = require('./ws-client');

export default class CertStreamClient{
    constructor(callback, skipHeartbeats = false) {
        this.context = {};
        this.callback = callback;
        this.skipHeartbeats = skipHeartbeats;
    }

    connect(){
        this.ws = new WebSocketClient("wss://certstream.calidog.io/");

        this.ws.onopen = () => {
            console.log("Connection established to certstream! Waiting for messages...");
        };

        this.ws.onmessage = (message) => {
            let parsedMessage = JSON.parse(message);

            if (parsedMessage.message_type === "heartbeat" && this.skipHeartbeats) {
                return;
            }

            this.callback(parsedMessage, this.context);
        };
    }
};

