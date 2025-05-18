
import { useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import { config } from "../constants/config";
import { toast } from "react-toastify";

interface Props {
    onChange: (file?: File) => void
}
export default function InputFile({ onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleUpload = () => {
        fileInputRef.current?.click()
    }
    const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target)
        const fileFromLocal = event.target.files?.[0];
        console.log(fileFromLocal?.size)
        console.log(fileFromLocal?.type)
        if (fileFromLocal && (fileFromLocal.size >= config.maxSizeImage || !fileFromLocal.type.includes('image'))) {
            toast.error('Dụng lượng file tối đa 1 MB')
        }
        else {
            onChange && onChange(fileFromLocal)
        }
    }
    return (
        <Fragment>
            <input className='hidden' type='file' accept='.jpg,.jpeg,.png' ref={fileInputRef} onChange={uploadAvatar} onClick={event => (event.target as HTMLInputElement).value = ''} />
            <button className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-xs cursor-pointer border-gray-300 capitalize hover:bg-gray-50' type='button' onClick={handleUpload}>
                Chọn ảnh
            </button>
        </Fragment>
    )
}
