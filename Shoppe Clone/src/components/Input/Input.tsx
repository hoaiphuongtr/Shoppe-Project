import { InputHTMLAttributes } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    type: React.HTMLInputTypeAttribute;
    register?: UseFormRegister<any>;
    classNameInput?: string;
    classNameError?: string;
    rules?: RegisterOptions;
    errorMessage?: string;
}

export default function Input({
    className,
    register,
    rules,
    classNameInput = 'p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    errorMessage,
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    name,
    ...rest
}: Props) {
    const registerResult = register && name ? register(name, rules) : {};
    
    return (
        <div className={className}>
            <input
                className={classNameInput}
                {...rest}
                {...registerResult}
            />
            <div className={classNameError}>{errorMessage}</div>
        </div>
    );
}
