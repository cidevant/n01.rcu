import OBSWebSocket from 'obs-websocket-js';

export let obsConnected = false;

export const obs = new OBSWebSocket();

export async function obsToggleScene(sceneName, url, password) {
    if (!obsConnected) {
        const result = await obsConnect(url, password);

        if (result !== true) {
            console.log('[ws.obs] error', result);

            return;
        }
    }

    try {
        await obs.call('SetCurrentProgramScene', { sceneName });

        setTimeout(() => {
            obs.call('SetCurrentProgramScene', { sceneName: 'main_scene' });
        }, 2000);
    } catch (error) {
        console.log('[ws.obs] error', error?.message ?? error);
    }
}

export async function obsConnect(url, password) {
    try {
        await obs.connect(url, password, {
            rpcVersion: 1,
        });

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
