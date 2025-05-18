export const path = {
    home: '/',
    user: '/user',
    login: '/login',
    changePassword: '/user/password',
    historyPurchase: '/user/purchase',
    register: '/register',
    logout: '/logout',
    profile: '/user/profile',
    productDetail: ':nameId',
    cart: '/cart',
    notFound: '*'
} as const;
