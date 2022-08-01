// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: (params = []) => ["events", ...params],
  QUERY_SINGLE_EVENT: ({ eventId }) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],
};

export const ALL_ENDPOINTS = {
  BUILD_GET_ALL_EVENTS: () => "/events",
  BUILD_GET_SINGLE_EVENT: ({ eventId }) => `/events/${eventId}`,
  BUILD_POST_NEW_EVENT: () => `/events`,
  BUILD_DELETE_EVENT: (id) => `/events/${id}`,
  // genres
  BUILD_GET_ALL_GENRES: () => `/genres`,

  // auth
  BUILD_LOGIN: () => `/login`,
  BUILD_REGISTER: () => `/signup`,
  BUILD_CHANGE_PASSWORD: () => `/changepassword`,
  BUILD_FORGOT_PASSWORD: () => `/forgetpassword`,
  BUILD_CONFIRM_PASSWORD: () => `/newpassword`,
};

export const APP_PATH = {
  login: "/login",
  // register: "/register",
  // forgotPassword: "/forgot-password",
  // resetPassword: "/reset-password",
  // changePassword: "/change-password",
  home: "/",
  eventsHome: "/events",
  allEvents: "/events/list",
  createEvent: "/events/new",
  catchAll: "*",
};
