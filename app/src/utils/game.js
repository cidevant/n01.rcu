export function validInputValue(value, leftScore) {
    return value >= 0 && value <= 180 && notGreaterThanLeftScore(value, leftScore);
}

export function notGreaterThanLeftScore(value, leftScore) {
    if (leftScore == null) {
        return false;
    }

    return leftScore > 0 && value <= leftScore;
}
