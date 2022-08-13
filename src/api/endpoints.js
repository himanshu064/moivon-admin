// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

import { TAB_TYPES } from "../pages/Events/ListEvent";
import { objectToQueryParams } from "../utils/helpers";

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: ({ type = "all", page = 1 }) => ["events", type, page],
  QUERY_SINGLE_EVENT: (eventId) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],

  // hero image
  QUERY_ALL_HERO_IMAGES: ({ page = 1 }) => ["heroSlider", page],
};

export const ALL_ENDPOINTS = {
  BUILD_GET_ALL_EVENTS: ({ page, type, size }) => {
    const data = {
      page,
      size,
    };

    if (type === TAB_TYPES.pending) {
      data.published = false;
    } else if (type === TAB_TYPES.approved) {
      data.published = true;
    } else if (type === TAB_TYPES.popular) {
      data.mostPopular = true;
    } else if (type === TAB_TYPES.upcoming) {
      data.upComing = true;
    }

    const qs = `?${objectToQueryParams(data)}`;
    return "/events" + qs;
  },
  BUILD_GET_SINGLE_EVENT: (eventId) => `/events/${eventId}`,
  BUILD_POST_NEW_EVENT: () => `/events`,
  BUILD_DELETE_EVENT: (id) => `/events/${id}`,
  BUILD_MULTIPLE_DELETE_EVENT: () => `/events/deleteevents`,
  BUILD_DELETE_EVENT_IMAGE: (imageId) => `/events/deleteimage/${imageId}`,
  BUILD_UPDATE_EVENT_STATUS: (id) => `/events/status/${id}`,
  // genres
  BUILD_GET_ALL_GENRES: () => `/genres`,

  // slider
  BUILD_CREATE_HERO_SLIDER: () => `/heroimage`,
  BUILD_GET_ALL_HERO_SLIDER: ({ page, size }) => {
    const data = {
      page,
      size,
    };
    const qs = `?${objectToQueryParams(data)}`;
    return "/heroimage" + qs;
  },
  BUILD_DELETE_HERO_SLIDER: (id) => `/heroimage/${id}`,
  BUILD_DELETE_HERO_SLIDER_IMAGE: (imageId) =>
    `/heroimage/deleteimage/${imageId}`,
  BUILD_UPDATE_HERO_SLIDER: (id) => `/heroimage/${id}`,
  // auth
  BUILD_LOGIN: () => `/login`,
  BUILD_REGISTER: () => `/signup`,
  BUILD_CHANGE_PASSWORD: () => `/changepassword`,
  BUILD_FORGOT_PASSWORD: () => `/forgetpassword`,
  BUILD_CONFIRM_PASSWORD: () => `/newpassword`,
  BUILD_REFRESH_TOKEN: () => `/refreshtoken`,
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
  singleEvent: "/events/list/:id",
  catchAll: "*",
};
