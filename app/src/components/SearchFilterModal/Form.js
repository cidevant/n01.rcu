import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import useData from '../../hooks/useData';

function SearchFilterForm(props) {
    const { activity } = useData();
    const { filter, keepScrollingBottom, dispatchKeepScrollingBottom } = useHomeInfo();
    const [scroll, setScroll] = useState(keepScrollingBottom);
    const [from, setFrom] = useState(filter.from);
    const [to, setTo] = useState(filter.to);
    const [cam, setCam] = useState(filter.cam);

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
                <Flex>
                    <FormInputWrapper className="mt-4">
                        <TitleForm>AVERAGE FROM</TitleForm>
                        <FormInput
                            disabled={activity !== 'search'}
                            type="number"
                            value={from}
                            onChange={updateFrom}
                        />
                    </FormInputWrapper>
                    <FormInputWrapper className="mt-4">
                        <TitleForm>AVERAGE TO</TitleForm>
                        <FormInput
                            disabled={activity !== 'search'}
                            type="number"
                            value={to}
                            onChange={updateTo}
                        />
                    </FormInputWrapper>
                </Flex>

                <Flex>
                    <ButtonWrapper className="d-grid gap-2 mt-4">
                        <TitleForm>ONLY WITH CAM</TitleForm>

                        <Button
                            size="lg"
                            onClick={updateCam}
                            variant={cam === true ? 'success' : 'secondary'}
                        >
                            <FontAwesomeIcon
                                className="text-white me-4"
                                icon={cam === true ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}
                            />
                            {cam === true ? 'ENABLED' : 'DISABLED'}
                        </Button>
                    </ButtonWrapper>

                    <ButtonWrapper className="d-grid gap-2 mt-4">
                        <TitleForm>AUTO SCROLL</TitleForm>

                        <Button
                            size="lg"
                            onClick={updateScroll}
                            variant={scroll === true ? 'success' : 'secondary'}
                        >
                            <FontAwesomeIcon
                                className="text-white me-4"
                                icon={scroll === true ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}
                            />
                            {scroll === true ? 'ENABLED' : 'DISABLED'}
                        </Button>
                    </ButtonWrapper>
                </Flex>
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
    text-align: center;
`;

const FormInput = styled(Form.Control)`
    font-size: 40px;
    border-width: 4px;
    height: 120px;
    border-radius: 0;
    outline: none;
    text-align: center;
`;

const ButtonWrapper = styled.div`
    z-index: 10;
    padding: 20px;
    width: 50%;

    & > button {
        border-radius: 0;
        font-size: 40px;
        height: 140px;
    }
`;

const Flex = styled.div`
    display: flex;
    flex-direction: row;
`;
