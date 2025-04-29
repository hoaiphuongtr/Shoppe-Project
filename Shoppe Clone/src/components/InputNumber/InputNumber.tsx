import { forwardRef, InputHTMLAttributes } from 'react';
interface Props extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string;
    classNameError?: string;
    errorMessage?: string;
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner({
    className,
    classNameInput = 'p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    errorMessage,
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    ...rest
},ref) {
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        if((/^\d+$/.test(value) || value === '') && onChange){
            onChange(event)
        }
    }
    return (
        <div className={className}>
            <input
                className={classNameInput}
                {...rest}
                onChange={handleChange}
                ref={ref}
               
            />
            <div className={classNameError}>{errorMessage}</div>
        </div>
    );
})
export default InputNumber
