export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
};

export const APP_CONFIG = {
  SITE_NAME: "My App",
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
};
