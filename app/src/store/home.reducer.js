import { WS_IN_PREFIX, WS_OUT_PREFIX } from '../utils/ws';
import { ACTIONS as GAME_ACTIONS } from './game.reducer';

const ACTIONS = {
    // in
    ON_SEARCH_PAGE: `${WS_IN_PREFIX}:ON_SEARCH_PAGE`,
    SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT: `${WS_IN_PREFIX}:SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT`,

    // out
    SEARCH_PAGE_SCROLL_BOTTOM: `${WS_OUT_PREFIX}:CLIENT:SEARCH_PAGE_SCROLL_BOTTOM`,
    SEARCH_PAGE_FILTER_BY_AVERAGE: `${WS_OUT_PREFIX}:CLIENT:SEARCH_PAGE_FILTER_BY_AVERAGE`,
    SEARCH_PAGE_START_GAME: `${WS_OUT_PREFIX}:CLIENT:SEARCH_PAGE_START_GAME`,
};

export function sendScrollBottom() {
    return {
        type: ACTIONS.SEARCH_PAGE_SCROLL_BOTTOM,
    };
}

export function sendFilterByAverage(payload) {
    return {
        type: ACTIONS.SEARCH_PAGE_FILTER_BY_AVERAGE,
        payload,
    };
}

export function sendStartGame(payload) {
    return {
        type: ACTIONS.SEARCH_PAGE_START_GAME,
        payload,
    };
}
const defaultFilter = {
    from: 0,
    to: 180,
};
const initialState = {
    onSearchPage: false,
    joinedSearch: false,
    lastGamePlayerId: null,
    players: [],
    filter: localStorage.getItem('filter') ?? defaultFilter,
};

export default function homeReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        // Page transitions
        case ACTIONS.ON_SEARCH_PAGE:
            state = {
                ...state,
                onSearchPage: true,
                joinedSearch: action.payload['payload'],
            };
            break;
        case GAME_ACTIONS.MATCH_START:
            state = {
                ...state,
                onSearchPage: false,
            };
            break;

        // Filter
        case ACTIONS.SEARCH_PAGE_FILTER_BY_AVERAGE: // out
            localStorage.setItem('filter', action.payload);
            state = {
                ...state,
                filter: action.payload,
            };
            break;
        case ACTIONS.SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT: // in
            state = {
                ...state,
                players: action.payload['payload'],
            };
            break;
        case ACTIONS.SEARCH_PAGE_START_GAME: // out
            state = {
                ...state,
                lastGamePlayerId: action.payload,
            };
            break;
    }

    return state;
}
