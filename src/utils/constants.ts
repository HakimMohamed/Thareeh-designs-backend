const constants = {
  FULL_ITEMS_PAGE_SIZE: 32,
  PUBLIC_ROUTES: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/otp/verify',
    '/api/auth/complete-registeration',
    '/api/auth/refresh-token',
    '/api/auth/logout',
    '/api/items',
    /^\/api\/items\/\w+$/,
    '/api/items/featured',
  ],
};

export default constants;
