import React from 'react';
import { StatusBar } from './StatusBar';

export function Layout(props) {
    return (
        <div>
            <StatusBar />
            {props.children}
        </div>
    );
}
