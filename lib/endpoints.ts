export const ENDPOINTS = {
  INQUIRY: '/api/inquiry',
  REGISTER_PARIVAR: '/api/register-parivar',
  SUPERADMIN_LOGIN: '/api/register-parivar/superadmin-login',
  PRICING: '/api/pricing',
  PRICING_ALL: '/api/pricing/all',
  
  // Dynamic Endpoints
  UPDATE_INQUIRY: (id: string) => `/api/inquiry/${id}`,
  UPDATE_PARIVAR: (id: string) => `/api/register-parivar/${id}`,
  UPDATE_PARIVAR_PASSWORD: (id: string) => `/api/register-parivar/${id}/password`,
  UPDATE_PRICING: (id: string) => `/api/pricing/${id}`,
};
