import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';

function Switch({ label, status, setstatus }) {
    const [isChecked, setIsChecked] = useState(status);
    return (
        <>
            <Form>
                <Form.Check
                title={"switch-for-"+label}
                    type="switch"
                    id={"switch-"+label}
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