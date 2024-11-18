const constants = {
  FULL_ITEMS_PAGE_SIZE: 32,
  PUBLIC_ROUTES: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/complete-registeration',
    '/api/auth/refresh-token',
    '/api/auth/logout',
    '/api/items',
    '/api/items/:id',
    '/api/items/featured',
  ],
};

export default constants;
