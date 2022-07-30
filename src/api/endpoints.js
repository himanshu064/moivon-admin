// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: () => ["events"],
  QUERY_SINGLE_EVENT: ({ eventId }) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],
};

export const ALL_ENDPOINTS = {
  BUILD_ALL_EVENTS: () => "/events?populate=*",
  BUILD_SINGLE_EVENT: ({ eventId }) => `/events/${eventId}?populate=*`,
  BUILD_POST_QUERY: () => `/queries`,
  BUILD_POST_NEW_EVENT: () => `/events`,
  BUILD_ALL_GENRES: () => `/genres`,

  // auth
  BUILD_LOGIN: () => `/login`,
  BUILD_REGISTER: () => `/signup`,
  BUILD_CHANGE_PASSWORD: () => `/changepassword`,
  BUILD_CONFIRM_PASSWORD: () => `/newpassword`,
};

export const APP_PATH = {
  login: "/login",
  register: "/register",
  home: "/",
};
