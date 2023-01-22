import OBSWebSocket from 'obs-websocket-js';

export let obsConnected = false;

export const obs = new OBSWebSocket();

export async function obsConnect() {
  try {
    await obs.connect('ws://devant.cz:4444', undefined, { rpcVersion: 1 });

    obsConnected = true;

    console.log('[ws.obs] connected');

    return true;
  } catch (error) {
    obsConnected = false;

    console.log('[ws.obs] connection error', error);

    return error?.message ?? error;
  }
}

export async function obsDisconnect() {
  try {
    await obs.disconnect();

    obsConnected = false;

    console.log('[ws.obs] disconnected');

    return true;
  } catch (error) {
    console.log('[ws.obs] disconnect error', error);

    return error?.message ?? error;
  }
}
