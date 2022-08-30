import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';

function SearchFilterForm(props) {
    const [from, setFrom] = useState(useSelector((state) => state.home.filter.from));
    const [to, setTo] = useState(useSelector((state) => state.home.filter.to));
    const [cam, setCam] = useState(useSelector((state) => state.home.filter.cam));
    const [scroll, setScroll] = useState(useSelector((state) => state.home.keepScrollingBottom));
    const { searchAvailable, dispatchKeepScrollingBottom } = useHomeInfo();

    function updateFrom(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value >= 0 && value <= 180) {
            setFrom(value);
            props.applyFormValues({
                from: parseInt(value, 10),
                to: parseInt(to, 10),
                cam,
            });
        }
    }

    function updateTo(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value >= 0 && value <= 180) {
            setTo(value);
            props.applyFormValues({
                from: parseInt(from, 10),
                to: parseInt(value, 10),
                cam,
            });
        }
    }

    function updateCam(event) {
        event.preventDefault();

        setCam(!cam);
        props.applyFormValues({
            from: parseInt(from, 10),
            to: parseInt(to, 10),
            cam: !cam,
        });
    }

    function updateScroll(event) {
        event.preventDefault();

        setScroll(!scroll);
        dispatchKeepScrollingBottom(!scroll);
    }

    return (
        <Form>
            <div className="d-grid">
                <FormInputWrapper className="mt-4">
                    <TitleForm>AVERAGE FROM</TitleForm>
                    <FormInput
                        disabled={!searchAvailable}
                        type="number"
                        value={from}
                        onChange={updateFrom}
                    />
                </FormInputWrapper>
                <FormInputWrapper className="mt-4">
                    <TitleForm>AVERAGE TO</TitleForm>
                    <FormInput
                        disabled={!searchAvailable}
                        type="number"
                        value={to}
                        onChange={updateTo}
                    />
                </FormInputWrapper>

                <ButtonWrapper className="d-grid gap-2 mt-4 mb-4">
                    <Button
                        size="lg"
                        onClick={updateCam}
                        variant={cam === true ? 'success' : 'secondary'}
                    >
                        <FontAwesomeIcon
                            className="text-white me-4"
                            icon={cam === true ? 'fa-solid fa-video' : 'fa-solid fa-video-slash'}
                        />
                        {cam === true ? 'ENABLED' : 'DISABLED'}
                    </Button>
                </ButtonWrapper>

                <ButtonWrapper className="d-grid gap-2 mt-5">
                    <Button
                        size="lg"
                        onClick={updateScroll}
                        variant={scroll === true ? 'success' : 'secondary'}
                    >
                        <FontAwesomeIcon
                            className="text-white me-4"
                            icon={
                                scroll === true
                                    ? 'fa-solid fa-arrow-down'
                                    : 'fa-solid fa-arrows-to-circle'
                            }
                        />
                        {scroll === true ? 'SCROLLING' : 'STILL'}
                    </Button>
                </ButtonWrapper>
            </div>
        </Form>
    );
}

export default SearchFilterForm;

const FormInputWrapper = styled.div`
    padding: 0 20px;
`;

const TitleForm = styled.div`
    color: #888;
    font-size: 40px;
`;

const FormInput = styled(Form.Control)`
    font-size: 40px;
    border-width: 4px;
    height: 120px;
    border-radius: 0;
    outline: none;
`;

const ButtonWrapper = styled.div`
    height: 100px;
    z-index: 10;
    padding: 20px;

    & > button {
        border-radius: 0;
        font-size: 80px;
    }
`;
