import type { RegisterOptions, UseFormGetValues } from 'react-hook-form';
import * as yup from 'yup';
function testMinMaxPrice(this: yup.TestContext<yup.AnyObject>) {
    const { price_max, price_min } = this.parent as {
        price_min: string;
        price_max: string;
    };
    if (price_max !== '' && price_min !== '') {
        return Number(price_max) >= Number(price_min);
    }
    return true;
}
type Rules = {
    [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions;
};

export const getRules = (getValues: UseFormGetValues<any>): Rules => ({
    email: {
        required: {
            value: true,
            message: 'Email là bắt buộc'
        },
        pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Email không đúng định dạng'
        },
        maxLength: {
            value: 160,
            message: 'Độ dài từ 5 - 160 ký tự'
        },
        minLength: {
            value: 5,
            message: 'Độ dài từ 5 - 160 ký tự'
        }
    },
    password: {
        required: {
            value: true,
            message: 'Password là bắt buộc'
        },
        maxLength: {
            value: 160,
            message: 'Độ dài từ 6 - 160 ký tự'
        },
        minLength: {
            value: 6,
            message: 'Độ dài từ 6 - 160 ký tự'
        }
    },
    confirm_password: {
        required: {
            value: true,
            message: 'Nhập lại password là bắt buộc'
        },
        maxLength: {
            value: 160,
            message: 'Độ dài từ 6 - 160 ký tự'
        },
        minLength: {
            value: 6,
            message: 'Độ dài từ 6 - 160 ký tự'
        },
        validate:
            typeof getValues === 'function'
                ? (value) =>
                      value === getValues('password') || 'Password không khớp'
                : undefined
    }
});
export const schema = yup.object({
    email: yup
        .string()
        .required('Email là bắt buộc')
        .email('Email không đúng định dạng')
        .min(5, 'Độ dài từ 5 - 160 ký tự')
        .max(160, 'Độ dài từ 5 - 160 ký tự'),
    password: yup
        .string()
        .required('Password là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự'),
    confirm_password: yup
        .string()
        .required('Nhập lại password là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự')
        .oneOf([yup.ref('password')], 'Password không khớp'),
    price_min: yup.string().default('').test({
        name: 'invalid-price',
        message: 'Giá không phù hợp',
        test: testMinMaxPrice
    }),
    price_max: yup.string().default('').test({
        name: 'invalid-price',
        message: 'Giá không phù hợp',
        test: testMinMaxPrice
    }),
    name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
});

export type Schema = yup.InferType<typeof schema>;
