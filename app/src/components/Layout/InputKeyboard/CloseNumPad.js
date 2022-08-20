import styled from 'styled-components';

export function CloseNumPad({ show }) {
    function hide() {
        show(false);
    }

    return (
        <CloseIconWrapper
            onClick={hide}
            className="d-flex align-items-center justify-content-center"
        >
            <i className="bi bi-x-circle"></i>
        </CloseIconWrapper>
    );
}

export default CloseNumPad;

const CloseIconWrapper = styled.div`
    cursor: pointer !important;
    position: absolute;
    bottom: 0;
    left: 0;
    margin-left: 10px;
    color: red;
    height: 100%;
    width: 160px;

    & > i {
        font-size: 120px;
    }
`;
