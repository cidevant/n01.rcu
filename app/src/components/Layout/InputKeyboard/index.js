import React, { useState } from 'react';
import InputNumPad from './InputNumPad';
import OpenNumPad from './OpenNumPad';
import { useNetworkInfo } from '../../../hooks/useNetworkInfo';

export function InputKeyboard() {
    const [isConnected, isPaired] = useNetworkInfo();
    const [showInput, setShowInput] = useState(false);

    if (!isConnected || !isPaired) {
        return;
    }

    return showInput ? <InputNumPad show={setShowInput} /> : <OpenNumPad show={setShowInput} />;
}

export default InputKeyboard;
