import styled from 'styled-components';

export const Phantom = styled.div`
    display: block;
    height: ${({ size }) => `${size ?? 200}px`};
    width: 100%;
`;

export const FixPositionWrapper = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
`;
