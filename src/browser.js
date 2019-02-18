import ReconnectingWebsocket from "reconnectingwebsocket"

export default class CertStreamClient{
    constructor(callback, skipHeartbeats = false) {
        this.context = {};
        this.callback = callback;
        this.skipHeartbeats = skipHeartbeats;
    }

    connect(url="wss://certstream.calidog.io/"){
        console.log(`Connecting to ${url}...`);

        this.ws = new ReconnectingWebsocket(url);

        console.log("Created ws -> ", this.ws);

        this.ws.onmessage = (message) => {
            console.log("onmessage called!");
            let parsedMessage = JSON.parse(message.data);

            if (parsedMessage.message_type === "heartbeat" && this.skipHeartbeats) {
                return
            }

            this.callback(message, this.context)
        };

        this.ws.onopen = () => {
            console.log("Connection established to certstream! Waiting for messages...");
        }

        this.ws.open();
    }
};
