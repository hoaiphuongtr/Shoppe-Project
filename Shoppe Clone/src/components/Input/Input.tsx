import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface Props {
    className: string;
    type: React.HTMLInputTypeAttribute;
    placeholder: string;
    rules?: RegisterOptions;
    errorMessage?: string;
    register: UseFormRegister<any>;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    name: string;
}

export default function Input({
    className,
    placeholder,
    register,
    rules,
    type,
    errorMessage,
    autoComplete,
    name
}: Props) {
    return (
        <div className={className}>
            <input
                type={type}
                className='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                placeholder={placeholder}
                autoComplete={autoComplete}
                {...register(name, rules)}
            />
            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>
                {errorMessage}
            </div>
        </div>
    );
}
