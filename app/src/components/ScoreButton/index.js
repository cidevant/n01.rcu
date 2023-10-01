import { useState } from 'react';
import Touchable from 'rc-touchable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from './index.style';

function ScoreButton({ score, buttonStyle, action }) {
    const [value, setValue] = useState(score);

    function onLongPress(event) {
        event.target.classList.add('confirmed');
        setValue(<FontAwesomeIcon icon="fa-solid fa-check" />);
        action(event.target.id);
    }

    function onPressOut(event) {
        event.target.classList.remove('error');
        event.target.classList.remove('confirmed');
        event.target.classList.remove('touching');
        event.target.classList.add('normal');
        setValue(score);
    }

    function onPressIn(event) {
        event.target.classList.add('touching');
    }

    return (
        <Touchable
            longPressCancelsPress
            activeStopPropagation
            onLongPress={onLongPress}
            delayPressIn={100}
            delayLongPress={250}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Button id={value} buttonStyle={buttonStyle}>
                {value}
            </Button>
        </Touchable>
    );
}

export default ScoreButton;
