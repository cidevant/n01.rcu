/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Connects to remote websocket server to control n01
 *
 * @class n01obs__WebSocketClient
 */
class n01obs__WebSocketClient {
  constructor() {
    this.__url = 'ws://localhost:3000/ws';
  }

  connect = () => {
    if (this.open) {
      console.log('[n01.obs.ws.client] connect error: already connected');
    } else {
      const player = n01obs__getPlayer();

      console.log(
        `[n01.obs.ws.client] connecting to ${this.__url} (name: ${player.sid}, id: ${player.playerName})`
      );

      this.__socket = new WebSocket(
        `${this.__url}?client=true&id=${player.sid}&name=${player.playerName}&accessCode=TEST`
      );
      this.__socket.onopen = this.__onOpen;
      this.__socket.onerror = this.__onError;
      this.__socket.onclose = this.__onClose;
      this.__socket.onmessage = this.__onMessage;
    }
  };

  disconnect = () => {
    if (this.open) {
      console.log('[n01.obs.ws.client] disconnecting');

      this.__socket.close();
    } else {
      console.log('[n01.obs.ws.client] disconnect error: no connection to server');

      n01obs__changeExtensionIcon('default');
    }
  };

  /**
   * Sends data to websocket server
   *
   * @param {*} data
   */
  send = (data) => {
    const msg = JSON.stringify(data);

    console.log('[n01.obs.ws.client] send message', msg);

    if (this.open) {
      this.__socket.send(msg);
    } else {
      console.log('[n01.obs.ws.client] send message error: no connection to server');
    }
  };

  /**
   * Receives data from websocket server
   *
   * @param {*} evt message event
   */
  __onMessage = (evt) => {
    console.log('[n01.obs.ws.client] received message', evt.data);

    n01obs__onWsMessage(JSON.parse(evt.data), this);
  };

  __onOpen = () => {
    console.log('[n01.obs.ws.client] connected');

    n01obs__changeExtensionIcon('connected');
  };

  __onClose = () => {
    console.log('[n01.obs.ws.client] closed connection');

    n01obs__changeExtensionIcon('default');
  };

  __onError = () => {
    console.log('[n01.obs.ws.client] connection failed');

    n01obs__changeExtensionIcon('failed');
  };

  get open() {
    return this.__socket && this.__socket.readyState === WebSocket.OPEN;
  }
}
