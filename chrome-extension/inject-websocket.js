/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Connects to remote websocket server to control n01
 *
 * @class n01obs__WebSocketClient
 */
class n01rcu_WebSocketClient {
  constructor() {
    this.__url = 'ws://localhost:3000/ws';
  }

  connect = () => {
    if (this.open) {
      	console.log('[n01.rcu.ws.client] connect error: already connected');
    } else {
        const player = n01rcu_getPlayer();
        const params = `?client=true&id=${player.sid}&name=${player.playerName}&accessCode=TEST`;

		console.log(
			`[n01.rcu.ws.client] connecting to ${this.__url} (name: ${player.sid}, id: ${player.playerName})`
		);

		this.__socket = new WebSocket(`${this.__url}${params}`);
		this.__socket.onopen = this.__onOpen;
		this.__socket.onerror = this.__onError;
		this.__socket.onclose = this.__onClose;
		this.__socket.onmessage = this.__onMessage;
    }
  };

  disconnect = () => {
    if (this.open) {
      console.log('[n01.rcu.ws.client] disconnecting');

      this.__socket.close();
    } else {
      console.log('[n01.rcu.ws.client] disconnect error: no connection to server');

     n01rcu_changeExtensionIcon('default');
    }
  };

  /**
   * Sends data to websocket server
   *
   * @param {*} data
   */
  send = (data) => {
    const msg = JSON.stringify(data);

    console.log('[n01.rcu.ws.client] send message', msg);

    if (this.open) {
      this.__socket.send(msg);
    } else {
      console.log('[n01.rcu.ws.client] send message error: no connection to server');
    }
  };

  /**
   * Receives data from websocket server
   *
   * @param {*} event message event
   */
  __onMessage = (event) => {
    console.log('[n01.rcu.ws.client] received message', event.data);

   n01rcu_onWsMessage(JSON.parse(event.data), this);
  };

  __onOpen = () => {
    console.log('[n01.rcu.ws.client] connected');

   n01rcu_changeExtensionIcon('connected');
  };

  __onClose = () => {
    console.log('[n01.rcu.ws.client] closed connection');

   n01rcu_changeExtensionIcon('default');
  };

  __onError = () => {
    console.log('[n01.rcu.ws.client] connection failed');

   n01rcu_changeExtensionIcon('failed');
  };

  get open() {
    return this.__socket && this.__socket.readyState === WebSocket.OPEN;
  }
}
