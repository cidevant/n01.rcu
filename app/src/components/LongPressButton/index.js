import React from 'react';
import Touchable from 'rc-touchable';

function LongPressButton({ onLongPress, onPressIn, onPressOut, children }) {
    return (
        <Touchable
            longPressCancelsPress
            activeStopPropagation
            onLongPress={onLongPress}
            delayPressIn={100}
            delayLongPress={300}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            {React.Children.only(children)}
        </Touchable>
    );
}

export default LongPressButton;
