import { WS_IN_PREFIX, WS_OUT_PREFIX } from '../utils/ws';

const ACTIONS = {
    SET_STATS: 'SET_STATS',
    SET_GAMES: 'SET_GAMES',
    SET_FILTER: 'SET_FILTER',
    SET_KEEP_SCROLLING_BOTTOM: 'SET_KEEP_SCROLLING_BOTTOM',

    // in
    SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT: `${WS_IN_PREFIX}:SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT`,

    // out
    SEARCH_PAGE_SCROLL_BOTTOM: `${WS_OUT_PREFIX}:CLIENT:SEARCH_PAGE_SCROLL_BOTTOM`,
    SEARCH_PAGE_FILTER_BY_AVERAGE: `${WS_OUT_PREFIX}:CLIENT:SEARCH_PAGE_FILTER_BY_AVERAGE`,
    START_GAME: `${WS_OUT_PREFIX}:CLIENT:START_GAME`,
};

export function sendScrollBottom(payload) {
    return {
        type: ACTIONS.SEARCH_PAGE_SCROLL_BOTTOM,
        payload,
    };
}

export function setStats(payload) {
    return {
        type: ACTIONS.SET_STATS,
        payload,
    };
}

export function setGames(payload) {
    return {
        type: ACTIONS.SET_GAMES,
        payload,
    };
}

export function sendFilterByAverage(payload) {
    return {
        type: ACTIONS.SEARCH_PAGE_FILTER_BY_AVERAGE,
        payload,
    };
}

export function setFilterByAverage(payload) {
    return {
        type: ACTIONS.SET_FILTER,
        payload,
    };
}

export function setKeepScrollingBottom(payload) {
    return {
        type: ACTIONS.SET_KEEP_SCROLLING_BOTTOM,
        payload,
    };
}

export function sendStartGame(payload) {
    return {
        type: ACTIONS.START_GAME,
        payload,
    };
}

let filterValue;

try {
    const json = JSON.parse(localStorage.getItem('filter'));

    if (Object.keys(json).length > 0) {
        filterValue = json;
    }
} catch (error) {
    filterValue = {
        from: 0,
        to: 180,
        updateInterval: 5,
        cam: true, // @TODO rename to CAM_ONLY
    };
}

const initialState = {
    loading: false,
    players: [],
    filter: filterValue,
    keepScrollingBottom: true,
    stats: null,
    games: null,
};

export default function homeReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        // Filter & search
        case ACTIONS.SET_FILTER:
            localStorage.setItem('filter', JSON.stringify(action.payload));
            state = {
                ...state,
                filter: {
                    ...state.filter,
                    ...action.payload,
                },
            };
            break;
        case ACTIONS.SET_STATS:
            state = {
                ...state,
                stats: action.payload,
            };
            break;
        case ACTIONS.SET_GAMES:
            state = {
                ...state,
                games: action.payload,
            };
            break;
        case ACTIONS.SEARCH_PAGE_FILTER_BY_AVERAGE:
            state = {
                ...state,
                loading: true,
            };
            break;
        case ACTIONS.SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT:
            state = {
                ...state,
                loading: false,
                players: action.payload['payload'],
            };
            break;

        // Scroll bottom
        case ACTIONS.SET_KEEP_SCROLLING_BOTTOM:
            state = {
                ...state,
                keepScrollingBottom: action.payload,
            };
            break;
    }

    return state;
}
