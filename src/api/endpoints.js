// BUILD_ prefix is for actual api endpoint
// QUERY_ prefix is for react-query state management

import { objectToQueryParams } from "../utils/helpers";

const TAB_TYPES = {
  all: "all",
  pending: "pending",
  approved: "approved",
  popular: "popular",
  upcoming: "upcoming",
};

export const ALL_QUERIES = {
  QUERY_ALL_EVENTS: ({ type = "all", page = 1, sort, order }) => [
    "events",
    { type, page, sort, order },
  ],
  QUERY_SINGLE_EVENT: (eventId) => ["event", eventId],
  QUERY_ALL_GENRES: () => ["genres"],

  // hero image
  QUERY_ALL_HERO_IMAGES: ({ page = 1 }) => ["heroSlider", page],
};

export const ALL_ENDPOINTS = {
  BUILD_GET_ALL_EVENTS: ({ page, type, size, sort, order }) => {
    const data = {
      page,
      size,
    };

    if (sort) {
      data["sort"] = sort;
    }
    if (order) {
      data["order"] = order;
    }

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
  BUILD_DELETE_EVENT_IMAGE: ({ imageId, eventId }) =>
    `/events/deleteimage?imageid=${imageId}&eventId=${eventId}`,
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
  BUILD_DELETE_HERO_SLIDER_IMAGE: ({ imageId, eventId }) =>
    `/heroimage/deleteimage?id=${imageId}&heroImageDetailId=${eventId}`,
  BUILD_UPDATE_HERO_SLIDER: (id) => `/heroimage/${id}`,

  // genres
  BUILD_ALL_GENRES: () => `/genres`,
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
  popularEvents: "/events/popular",
  upcomingEvents: "/events/upcoming",
  createEvent: "/events/new",
  singleEvent: "/events/list/:id",
  popularSingleEvent: "/events/popular/:id",
  upcomingSingleEvent: "/events/upcoming/:id",
  catchAll: "*",
};
