import styled from 'styled-components';

export const Sticky = styled.div`
    position: fixed;
    ${(props) => (props.bottom ? 'bottom' : 'top')}: 0;
    left: 0;
    width: 100%;
`;

export const StickyPhantom = styled.div`
    display: block;
    height: ${({ size }) => `${size ?? 200}px`};
    width: 100%;
`;
