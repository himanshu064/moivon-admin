// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

import { TAB_TYPES } from "../pages/Events/ListEvent";
import { objectToQueryParams } from "../utils/helpers";

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: ({ type = "all", page = 1 }) => ["events", type, page],
  QUERY_SINGLE_EVENT: ({ eventId }) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],
};

export const ALL_ENDPOINTS = {
  BUILD_GET_ALL_EVENTS: ({ page, type }) => {
    const data = {
      page,
    };
    if (type !== TAB_TYPES.all) {
      data["published"] = type === "approved";
    }

    const qs = `?${objectToQueryParams(data)}`;
    return "/events" + qs;
  },
  BUILD_GET_SINGLE_EVENT: ({ eventId }) => `/events/${eventId}`,
  BUILD_POST_NEW_EVENT: () => `/events`,
  BUILD_DELETE_EVENT: (id) => `/events/${id}`,
  BUILD_UPDATE_EVENT_STATUS: (id) => `/events/status/${id}`,
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
