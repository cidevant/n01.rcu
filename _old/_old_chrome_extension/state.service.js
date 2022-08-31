class AppStateEventTarget extends EventTarget {}

class StateSingleton {
    static instance;
    static EVENT_TARGET;
    static EVENT_NAME_PREFIX = '[n01.RCU].Event.';

    constructor() {
        if (StateSingleton.instance != null) {
            return StateSingleton.instance;
        }

        StateSingleton.instance = this;
        StateSingleton.EVENT_TARGET = new AppStateEventTarget();

        return this;
    }

    addEventListener(eventName, eventListener) {
        StateSingleton.EVENT_TARGET.addEventListener(
            `${StateSingleton.EVENT_NAME_PREFIX}${eventName}`,
            eventListener
        );
    }

    removeEventListener(eventName, eventListener) {
        StateSingleton.EVENT_TARGET.removeEventListener(
            `${StateSingleton.EVENT_NAME_PREFIX}${eventName}`,
            eventListener
        );
    }

    dispatchEvent(eventName, eventData) {
        const event = new CustomEvent(`${StateSingleton.EVENT_NAME_PREFIX}${eventName}`, {
            detail: eventData,
        });

        StateSingleton.EVENT_TARGET.dispatchEvent(event);
    }
}

const AppState = new Proxy(new StateSingleton(), {
    get(obj, prop) {
        console.log(`===================> proxy.get ${prop}`, obj[prop]);

        return obj[prop];
    },

    set(obj, prop, value) {
        console.log(`===================> proxy.set ${prop} to ${value}`);

        if (prop === 'icon') {
            console.log('===================> proxy.set.dispatchEvent event ICON');

            obj.dispatchEvent('icon', value);
        }

        return Reflect.set(...arguments);
    },
});

AppState.addEventListener('icon', (event) => {
    console.log('===================> icon changed', event);
});
