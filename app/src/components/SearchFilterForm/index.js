import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import useData from '../../hooks/useData';

function SearchFilterForm() {
    const { dispatchSetFilter } = useHomeInfo();
    const { activity } = useData();
    const { filter, keepScrollingBottom, dispatchKeepScrollingBottom } = useHomeInfo();
    const [scroll, setScroll] = useState(keepScrollingBottom);
    const [from, setFrom] = useState(filter.from);
    const [to, setTo] = useState(filter.to);
    const [updateInterval, setUpdateInterval] = useState(filter.updateInterval);
    const [cam, setCam] = useState(filter.cam);

    function updateFrom(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value >= 0 && value <= 180) {
            setFrom(value);
            dispatchSetFilter({
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
            dispatchSetFilter({
                from: parseInt(from, 10),
                to: parseInt(value, 10),
                cam,
            });
        }
    }

    function updateCam(event) {
        event.preventDefault();

        setCam(!cam);
        dispatchSetFilter({
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

    function updateUpdateInterval(event) {
        event.preventDefault();

        const { value } = event.target;

        if (value >= 0) {
            setUpdateInterval(value);

            dispatchSetFilter({
                from: parseInt(from, 10),
                to: parseInt(to, 10),
                updateInterval: parseInt(value, 10),
                cam,
            });
        }
    }

    return (
        <>
            <StatusWrapper>SEARCH FORM</StatusWrapper>
            <Form>
                <div className="d-grid mb-4">
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
                    <FormInputWrapper className="mt-4">
                        <TitleForm>UPDATE INTERVAL</TitleForm>
                        <FormInput
                            disabled={activity !== 'search'}
                            type="number"
                            value={updateInterval}
                            onChange={updateUpdateInterval}
                        />
                    </FormInputWrapper>
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
                                    icon={
                                        scroll === true ? 'fa-solid fa-check' : 'fa-solid fa-xmark'
                                    }
                                />
                                {scroll === true ? 'ENABLED' : 'DISABLED'}
                            </Button>
                        </ButtonWrapper>
                    </Flex>
                </div>
            </Form>
        </>
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

const StatusWrapper = styled.div`
    width: 100%;
    padding: 35px 15px;
    background-color: #eee;
    color: #999;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    font-weight: bold;
    text-align: center;
    font-size: 32px;
    z-index: 1;
`;
