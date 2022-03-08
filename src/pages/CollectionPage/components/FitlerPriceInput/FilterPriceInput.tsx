import * as React from 'react';
import InputUnstyled, { InputUnstyledProps } from '@mui/base/InputUnstyled';
import { styled } from '@mui/system';

const StyledInputElement = styled('input')(
    ({ theme }) => `
    width: 100%;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: #95969b;
    background: #090619;
    border: none;
    border-radius: 5px;
    padding: 12px 12px;
    margin-top: 15px;
    outline: none;
    &:hover {
        background: #090619b3;
    }

`,
);

const CustomInput = React.forwardRef(function CustomInput(
    props: InputUnstyledProps,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    return (
        <InputUnstyled components={{ Input: StyledInputElement }} {...props} ref={ref} />
    );
});

export default function FilterPriceInput(props: { value: string, placeholder: string, setValue: Function }) {
    const handleChange = (e) => {
        props.setValue(e.target.value)
    }
    return (
        <CustomInput
            type="number"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => handleChange(e)}
        />
    )
}
