class n01rcu_AppStateEventTarget extends EventTarget {}

class n01rcu_AppStateSingleton {
    static instance;
    static EVENT_TARGET;

    EVENT_LISTENERS = {};
    EVENTS = {
        CONNECTION_STATE_CHANGED: 'CONNECTION_STATE_CHANGED',
        PAIRED_CHANGED: 'PAIRED_CHANGED',
        URL_CHANGED: 'URL_CHANGED',
        ACCESS_CODE_CHANGED: 'ACCESS_CODE_CHANGED',
        CURRENT_PAGE_CHANGED: 'CURRENT_PAGE_CHANGED',
        SEARCHING_CHANGED: 'SEARCHING_CHANGED',
        ICON_CHANGED: 'ICON_CHANGED',
    };

    __connectionState = false;
    __paired = false;
    __url;
    __accessCode;
    __currentPage;
    __searching = false;
    __icon = 'default';

    // Singleton
    constructor() {
        if (n01rcu_AppStateSingleton.instance != null) {
            return n01rcu_AppStateSingleton.instance;
        }

        n01rcu_AppStateSingleton.instance = this;
        n01rcu_AppStateSingleton.EVENT_TARGET = new n01rcu_AppStateEventTarget();

        return this;
    }

    addEventListener(eventName, eventListener) {
        n01rcu_AppStateSingleton.EVENT_TARGET.addEventListener(eventName, eventListener);
    }

    removeEventListener(eventName, eventListener) {
        n01rcu_AppStateSingleton.EVENT_TARGET.removeEventListener(eventName, eventListener);
    }

    dispatchEvent(eventName, eventData) {}

    // __dispatchEvent(eventName, eventData) {
    //     this.EVENT_LISTENERS[eventName]?.forEach?.(listener => {
    //         listener(eventData);
    //     });
    // }

    // __addEventListener(eventName, eventListener)  {
    //     if (this.EVENT_LISTENERS[eventName] == null) {
    //         this.EVENT_LISTENERS[eventName] = [];
    //     }

    //     this.EVENT_LISTENERS[eventName].push(eventListener);
    // }

    // __removeEventListener(eventName, eventListener)  {
    //     const idx = this.EVENT_LISTENERS[eventName].find(listener => listener === eventListener);

    //     if (~idx) {
    //         this.EVENT_LISTENERS[eventName].splice(idx, 1);
    //     }
    // }

    set connectionState(v) {
        const prevValue = this.__connectionState;

        this.__connectionState = v;

        this.__dispatchEvent(this.EVENTS.CONNECTION_STATE_CHANGED, {
            before: prevValue,
            after: v,
        });
    }

    set paired(v) {
        const prevValue = this.__paired;

        this.__paired = v;

        this.__dispatchEvent(this.EVENTS.PAIRED_CHANGED, {
            before: prevValue,
            after: v,
        });
    }

    set url(v) {
        const prevValue = this.__url;

        this.__url = v;

        this.__dispatchEvent(this.EVENTS.URL_CHANGED, {
            before: prevValue,
            after: v,
        });
    }

    set accessCode(v) {
        const prevValue = this.__accessCode;

        this.__accessCode = v;

        this.__dispatchEvent(this.EVENTS.ACCESS_CODE_CHANGED, {
            before: prevValue,
            after: v,
        });
    }

    set currentPage(v) {
        const prevValue = this.__currentPage;

        this.__currentPage = v;

        this.__dispatchEvent(this.EVENTS.CURRENT_PAGE_CHANGED, {
            before: prevValue,
            after: v,
        });
    }

    set searching(v) {
        const prevValue = this.__searching;

        this.__searching = v;

        this.__dispatchEvent(this.EVENTS.SEARCHING_CHANGED, {
            before: prevValue,
            after: v,
        });
    }

    set icon(v) {
        const prevValue = this.__icon;

        this.__icon = v;

        this.__dispatchEvent(this.EVENTS.ICON_CHANGED, {
            before: prevValue,
            after: v,
        });
    }
}

const n01rcu_AppState = new n01rcu_AppStateSingleton();
