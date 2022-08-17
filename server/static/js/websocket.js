/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

class WebSocketClient {
  constructor() {
    this.__url = `ws://${window.location.host}/ws`;
  }

  connect = (cb) => {
    this.__openCallback = cb;

    if (this.open) {
      console.error('[n01.obs.ws.controller] connect error: already connected');
    } else {
      this.__socket = new WebSocket(
        `${this.__url}?client=false&id=${Math.random()}&name=${this.__getName()}&accessCode=TEST`
      );
      this.__socket.onopen = this.__onOpen;
      this.__socket.onclose = this.__onClose;
      this.__socket.onerror = this.__onError;
      this.__socket.onmessage = this.__onMessage;
    }
  };

  __getName = () => {
    try {
      return navigator.userAgent.split('(')[1].split(')')[0];
    } catch (error) {
      return navigator.userAgent;
    }
  };

  disconnect = (cb) => {
    this.__closeCallback = cb;

    if (this.open) {
      console.log('[n01.obs.ws.controller] disconnecting');

      this.__socket.close();
    } else {
      console.error('[n01.obs.ws.controller] disconnect error: no connection to server');
    }
  };

  /**
   * Sends data to websocket server
   *
   * @param {*} data
   */
  send = (data) => {
    const msg = JSON.stringify(data);

    console.log('[n01.obs.ws.controller] send message', msg);

    if (this.open) {
      this.__socket.send(msg);
    } else {
      console.error('[n01.obs.ws.controller] send message error: no connection to server');
    }
  };

  /**
   * Receives data from websocket server
   *
   * @param {*} evt message event
   */
  __onMessage = (evt) => {
    console.log('[n01.obs.ws.controller] received message', evt.data);
  };

  __onOpen = () => {
    console.log('[n01.obs.ws.controller] connected');

    this.__openCallback?.();
  };

  __onClose = () => {
    console.log('[n01.obs.ws.controller] closed connection');

    this.__closeCallback?.();
  };

  __onError = (error) => {
    console.log('[n01.obs.ws.controller] error', error);
  };

  get open() {
    return this.__socket && this.__socket.readyState === WebSocket.OPEN;
  }
}

const n01obs__controller = new WebSocketClient();
