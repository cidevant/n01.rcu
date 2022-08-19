import styled from 'styled-components';
import Icon from '../../../assets/icons/numpad.png';
import { Phantom, FixPositionWrapper } from './_shared';

export function NumPadIcon({ show }) {
    function onClick() {
        setTimeout(() => {
            show(true);
        }, 200);
    }

    return (
        <>
            <Phantom size={200} />
            <FixPositionWrapper className="p-5 d-flex justify-content-end w-100">
                <NumPadIconWrapper
                    className="d-flex align-items-center justify-content-center"
                    onClick={onClick}
                >
                    <NumPadIconImage src={Icon} />
                </NumPadIconWrapper>
            </FixPositionWrapper>
        </>
    );
}

export default NumPadIcon;

const NumPadIconWrapper = styled.button`
    cursor: pointer !important;
    width: 150px;
    height: 150px;
    background-color: #222;
    border-radius: 75px;
    box-shadow: 0px 15px 20px 0px rgba(0, 0, 0, 0.5);
    border: 0;
    color: #fff;
    transition: transform ease-in-out 100ms;
    outline: none;

    &:active {
        background-color: #161616;
        transform: translate(5px, 10px);
    }
`;

const NumPadIconImage = styled.img`
    width: 150px;
    height: 150px;
`;
