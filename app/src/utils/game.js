export const SCENES = [
    {
        name: '26',
        code: '26_scene',
        score: '26',
    },
    {
        name: '100',
        code: '100_scene',
        score: '100',
    },
    {
        name: '007',
        code: '007_scene',
        score: '7',
    },
    {
        name: '13',
        code: '13_scene',
        score: '13',
    },
    {
        name: '27',
        code: '27_scene',
        score: '27',
    },
    {
        name: '33',
        code: '33_scene',
        score: '33',
    },
    {
        name: '180',
        code: '180_scene',
        score: '180',
    },
];

export const SCENES_GREETINGS = [
    {
        name: 'hello',
        code: 'hello_scene',
        style: 'green',
    },
    {
        name: 'bye',
        code: 'bye_scene',
        style: 'red',
    },
];

export const SCENES_MEMES = [
    [
        {
            name: 'nice',
            code: 'nice_scene',
            style: 'yellow',
        },
        {
            name: 'wow',
            code: 'wow_scene',
            style: 'yellow',
        },
        {
            name: 'gg',
            code: 'gg_scene',
            style: 'yellow',
        },
    ],
    [
        {
            name: 'your turn',
            code: 'your_turn_scene',
            style: 'yellow',
        },
        {
            name: 'repeat?',
            code: 'repeat_game_scene',
            style: 'yellow',
            delay: 4000,
        },
    ],
];

const SCORES_COMMON = [
    [
        {
            value: 26,
            style: 'yellow',
            scene: '26_scene',
        },
        {
            value: 58,
            style: 'yellow',
        },
        {
            value: 43,
            style: 'yellow',
        },
    ],
    [
        {
            value: 45,
            style: 'yellow',
        },
        {
            value: 60,
            style: 'good',
        },
        {
            value: 41,
            style: 'yellow',
        },
    ],
    [
        {
            value: 85,
            style: 'yellow',
        },
        {
            value: 100,
            style: 'good',
            scene: '100_scene',
        },

        {
            value: 81,
            style: 'yellow',
        },
    ],
    [
        {
            value: 95,
            style: 'yellow',
        },
        {
            value: 98,
            style: 'yellow',
        },
        {
            value: 83,
            style: 'yellow',
        },
    ],
    [
        22,
        {
            value: 94,
            style: 'yellow',
        },
        24,
    ],
    [36, 30, 28],
    [39, 38, 55],
];

const SCORES_OUTS = [
    [2, 4, 8],
    [10, 16, 20],
    [21, 23, 25],
    [32, 33, 34],
    [35, 37, 44],
    [46, 48, 54],
    [56, 57, 59],
];

const SCORES_HIGH = [
    [40, 62, 64],
    [66, 68, 70],
    [76, 78, 79],
    [80, 96, 97],
    [99, 120, 121],
    [123, 125, 134],
    [135, 137, 138],
    [140, 160, 180],
];

export const SCORES_LIST = {
    HIGH: 'HIGH',
    COMMON: 'COMMON',
    OUTS: 'OUTS',
};

export const SCORES = {
    [SCORES_LIST.HIGH]: SCORES_HIGH,
    [SCORES_LIST.COMMON]: SCORES_COMMON,
    [SCORES_LIST.OUTS]: SCORES_OUTS,
};

const CHECKOUTS = [
    {
        170: ['T20', 'T20', 'BULL'],
        161: ['T20', 'T17', 'BULL'],
        157: ['T20', 'T19', 'D20'],
        154: ['T20', 'T18', 'D20'],
        151: ['T20', 'T17', 'D20'],
        148: ['T20', 'T20', 'D14'],
        145: ['T20', 'T19', 'D14'],
        142: ['T20', 'T14', 'D20'],
        139: ['T19', 'T14', 'D20'],
        136: ['T20', 'T20', 'D8'],
        133: ['T20', 'T19', 'D8'],
        130: ['T20', 'T18', 'D8'],
        127: ['T20', 'T17', 'D8'],
        124: ['T20', 'T16', 'D8'],
        121: ['T20', 'T11', 'D14'],
        118: ['T20', '18', 'D20'],
        115: ['T19', '18', 'D20'],
        112: ['T20', 'T12', 'D8'],
        109: ['T20', '9', 'D20'],
        106: ['T20', '6', 'D20'],
        103: ['T17', '12', 'D20'],
        100: ['T20', 'D20'],
        97: ['T19', 'D20'],
        94: ['T18', 'D20'],
        91: ['T17', 'D20'],
        88: ['T16', 'D20'],
        85: ['T15', 'D20'],
        82: ['T14', 'D20'],
        79: ['T13', 'D20'],
        76: ['T20', 'D8'],
        73: ['T19', 'D8'],
        70: ['T18', 'D8'],
        67: ['T17', 'D8'],
        64: ['T16', 'D8'],
        61: ['T15', 'D8'],
        58: ['18', 'D20'],
        55: ['15', 'D20'],
        52: ['12', 'D20'],
        49: ['9', 'D20'],
        46: ['14', 'D16'],
        43: ['11', 'D16'],
        39: ['7', 'D16'],
        33: ['1', 'D16'],
        27: ['11', 'D8'],
        21: ['5', 'D8'],
        15: ['7', 'D4'],
        9: ['1', 'D4'],
        3: ['1', 'D1'],
    },
    {
        167: ['T20', 'T19', 'BULL'],
        160: ['T20', 'T20', 'D20'],
        156: ['T20', 'T20', 'D18'],
        153: ['T20', 'T19', 'D18'],
        150: ['T20', 'T18', 'D18'],
        147: ['T20', 'T17', 'D18'],
        144: ['T20', 'T20', 'D12'],
        141: ['T20', 'T19', 'D12'],
        138: ['T20', 'T18', 'D12'],
        135: ['T20', 'T17', 'D12'],
        132: ['T20', 'T16', 'D12'],
        129: ['T19', 'T16', 'D12'],
        126: ['T19', 'T15', 'D12'],
        123: ['T19', 'T14', 'D12'],
        120: ['T20', '20', 'D20'],
        117: ['T20', '17', 'D20'],
        114: ['T20', '14', 'D20'],
        111: ['T19', '14', 'D20'],
        108: ['T19', '19', 'D16'],
        105: ['T19', '8', 'D20'],
        102: ['T20', '10', 'D16'],
        99: ['T19', '10', 'D16'],
        96: ['T20', 'D18'],
        93: ['T19', 'D18'],
        91: ['T17', 'D20'],
        87: ['T17', 'D18'],
        84: ['T20', 'D12'],
        81: ['T19', 'D12'],
        78: ['T18', 'D12'],
        75: ['T17', 'D12'],
        72: ['T16', 'D12'],
        69: ['T19', 'D6'],
        66: ['T14', 'D12'],
        63: ['T13', 'D12'],
        60: ['20', 'D20'],
        57: ['17', 'D20'],
        54: ['14', 'D20'],
        51: ['11', 'D20'],
        48: ['8', 'D20'],
        45: ['13', 'D16'],
        42: ['10', 'D16'],
        37: ['5', 'D16'],
        31: ['7', 'D12'],
        25: ['9', 'D8'],
        19: ['3', 'D8'],
        13: ['5', 'D4'],
        7: ['3', 'D2'],
    },
    {
        164: ['T20', 'T18', 'BULL'],
        158: ['T20', 'T20', 'D19'],
        155: ['T20', 'T19', 'D19'],
        152: ['T20', 'T20', 'D16'],
        149: ['T20', 'T19', 'D16'],
        146: ['T20', 'T18', 'D16'],
        143: ['T19', 'T18', 'D16'],
        140: ['T20', 'T20', 'D10'],
        137: ['T20', 'T19', 'D10'],
        134: ['T20', 'T14', 'D16'],
        131: ['T20', 'T13', 'D16'],
        128: ['T18', 'T14', 'D16'],
        125: ['T18', 'T13', 'D16'],
        122: ['T18', 'T18', 'D7'],
        119: ['T19', 'T12', 'D13'],
        116: ['T20', '16', 'D20'],
        113: ['T19', '16', 'D20'],
        110: ['T20', '10', 'D20'],
        107: ['T20', '15', 'D16'],
        104: ['T20', 'T12', 'D4'],
        101: ['T17', '10', 'D20'],
        98: ['T20', 'D19'],
        95: ['T19', 'D19'],
        92: ['T20', 'D16'],
        89: ['T19', 'D16'],
        86: ['T18', 'D16'],
        83: ['T17', 'D16'],
        80: ['T20', 'D10'],
        77: ['T15', 'D16'],
        74: ['T14', 'D16'],
        71: ['T13', 'D16'],
        68: ['T20', 'D4'],
        65: ['T19', 'D4'],
        62: ['T10', 'D16'],
        59: ['19', 'D20'],
        56: ['T16', 'D4'],
        53: ['12', 'D20'],
        50: ['10', 'D20'],
        47: ['15', 'D16'],
        44: ['12', 'D16'],
        41: ['9', 'D16'],
        35: ['3', 'D16'],
        29: ['13', 'D8'],
        23: ['7', 'D8'],
        17: ['13', 'D2'],
        11: ['3', 'D4'],
        5: ['1', 'D2'],
    },
];

export function validInputValue(value, leftScore) {
    return value >= 0 && value <= 180 && notGreaterThanLeftScore(value, leftScore);
}

export function notGreaterThanLeftScore(value, leftScore) {
    if (leftScore == null) {
        return false;
    }

    return leftScore > 0 && value <= leftScore;
}

export function isOneDartCheckout(leftScore) {
    return leftScore > 0 && leftScore <= 60 && leftScore % 2 === 0;
}

/**
 * Returns list of CHECKOUTS
 *
 * @export
 * @param {*} score
 * @returns {Array<Array<string>>} list of CHECKOUTS
 */
export function getCheckouts(score) {
    const result = [];

    CHECKOUTS.forEach((possibility) => {
        if (possibility[score] != null) {
            result.push(possibility[score]);
        }
    });

    return result;
}
