const WebSocket = require("ws");

export default class WebSocketClient {
  constructor(url, reconnectInterval) {
    this.url = url;
    this.autoReconnectInterval = reconnectInterval || 5000;
    this.instance = new WebSocket(this.url);
    this.instance.on('open', () => {
      this.onopen();
    });

    this.instance.on('message', (data, flags) => {
      this.onmessage(data, flags);
    });

    this.instance.on('close', (e) => {
      switch (e) {
        // if its closed manually, then do not reconnect
        case 1000:
          break;
        default:
          this.reconnect(e);
          break;
      }
      this.onclose(e);
    });

    this.instance.on('error', (e) => {
      switch (e.code) {
        case 'ECONNREFUSED':
          this.reconnect(e);
          break;
        default:
          this.onerror(e);
          break;
      }
    });
  }

  send(data, option) {
    try {
      this.instance.send(data, option);
    }
    catch (e) {
      this.instance.emit('error', e);
    }
  }
  reconnect(e) {
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);

    this.instance.removeAllListeners();
    setTimeout(() => {
      console.log('WebSocketClient: reconnecting...');
      this.open(this.url);
    }, this.autoReconnectInterval);
  }
}

