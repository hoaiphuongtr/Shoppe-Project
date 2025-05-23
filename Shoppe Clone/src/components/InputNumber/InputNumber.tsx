import { forwardRef, InputHTMLAttributes, useState } from 'react';
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string;
    classNameError?: string;
    errorMessage?: string;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner({
    className,
    classNameInput = 'p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    errorMessage,
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    value = '',
    onChange,
    ...rest
}, ref) {
    const [localValue, setLocalValue] = useState<string>(value as string)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (/^\d+$/.test(value) || value === '') {
            onChange && onChange(event)
            setLocalValue(value)
        }
    }
    return (
        <div className={className}>
            <input
                className={classNameInput}
                {...rest}
                onChange={handleChange}
                ref={ref}
                value={value || localValue}

            />
            <div className={classNameError}>{errorMessage}</div>
        </div>
    );
})
export default InputNumber
