import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useHomeInfo from '../../hooks/useHomeInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';

function AccessCodeForm(props) {
    const [from, setFrom] = useState(useSelector((state) => state.home.filter.from));
    const [to, setTo] = useState(useSelector((state) => state.home.filter.to));
    const { searchAvailable } = useHomeInfo();

    function updateFrom(event) {
        event.preventDefault();
        setFrom(event.target.value);
    }

    function updateTo(event) {
        event.preventDefault();
        setTo(event.target.value);
    }

    function applyFilter() {
        props.applyFormValues({
            from,
            to,
        });
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

                <ButtonWrapper className="d-grid gap-2">
                    <Button size="lg" onClick={applyFilter} variant="success">
                        <FontAwesomeIcon icon="fa-solid fa-filter" className="text-white me-4" />
                        APPLY FILTER
                    </Button>
                </ButtonWrapper>
            </div>
        </Form>
    );
}

export default AccessCodeForm;

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
