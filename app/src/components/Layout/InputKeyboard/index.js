import React, { useState } from 'react';
import InputNumPad from './InputNumPad';
import OpenNumPad from './OpenNumPad';

export function InputKeyboard() {
    const [showInput, setShowInput] = useState(false);

    return showInput ? <InputNumPad show={setShowInput} /> : <OpenNumPad show={setShowInput} />;
}

export default InputKeyboard;
