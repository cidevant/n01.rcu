import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

export async function obsToggleScene(sceneName, url, password, delay = 2000) {
    if (!url) {
        return 'no obs url';
    }

    if (!isObsConnected()) {
        await obsConnect(url, password);
    }

    if (isObsConnected()) {
        try {
            await obs.call('SetCurrentProgramScene', { sceneName });

            setTimeout(async () => {
                await obs.call('SetCurrentProgramScene', { sceneName: 'main_scene' });
            }, delay);
        } catch (error) {
            console.log('[ws.obs] obsToggleScene error', error?.message ?? error);
        }
    }
}

export async function obsConnect(url, password) {
    try {
        await obs.connect(url, password, {
            rpcVersion: 1,
        });

        return true;
    } catch (error) {
        console.log('[ws.obs] connect error', error);

        return error?.message ?? error;
    }
}

export async function obsDisconnect() {
    try {
        await obs.disconnect();

        return true;
    } catch (error) {
        console.log('[ws.obs] disconnect error', error);

        return error?.message ?? error;
    }
}

export function isObsConnected() {
    return obs?.socket?.readyState === WebSocket.OPEN;
}
