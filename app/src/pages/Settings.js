import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const navigate = useNavigate();

    function goHome() {
        navigate('/');
    }

    return (
        <div>
            <BackButton onClick={goHome}>BACK TO HOME</BackButton>
        </div>
    );
}

export default Settings;

const BackButton = styled.button``;
