import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';

function Switch({ label, status, setstatus }) {
    const [isChecked, setIsChecked] = useState(status);
    return (
        <>
            <Form>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={isChecked ? `Hide ${label}` : `Show ${label}`}
                    checked={isChecked}
                    onChange={(e) => {
                        setIsChecked(e.target.checked);
                        setstatus(e.target.checked)
                    }}
                />
            </Form>
        </>
    );
}

export default Switch;