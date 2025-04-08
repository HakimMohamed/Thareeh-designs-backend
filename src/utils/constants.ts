const constants = {
  FULL_ITEMS_PAGE_SIZE: 32,
  PUBLIC_ROUTES: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/otp/verify',
    '/api/auth/complete-registeration',
    '/api/auth/refresh-token',
    '/api/auth/logout',
    '/api/items/item',
    '/api/items',
    '/api/items/featured',
    '/api/items/search',
    '/api/banner-settings',
    '/api/categories',
    {
      url: /^\/api\/categories\/[A-Za-z0-9_-]+$/,
      methods: ['GET'],
    },
  ],
};

export default constants;
