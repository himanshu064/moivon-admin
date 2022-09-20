import axios from "axios";
import { HEADERS } from "../constants";
import { refreshAccessToken } from "../services/auth";
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "../utils/localStorage";

export const BASE_URL = process.env.REACT_APP_BASE_API_URL;
const API_BASE_URL = `${BASE_URL}`;

// export const preparePublicFolder = (url) =>
//   `${process.env.REACT_APP_PUBLIC_URL}${url}`;

export const preparePublicFolder = (url) => `${url}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS.jsonData,
});

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(function (config) {
  const auth = getLocalStorage("auth");
  config.headers.Authorization =
    auth && auth.token ? `Bearer ${auth.token}` : "";
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    try {
      const originalRequest = error.config;
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        // get existing token
        const auth = getLocalStorage("auth");

        const { data } = await refreshAccessToken(auth.refreshToken);
        error.response.config.headers.Authorization = "Bearer " + data.newToken;
        // update localstorage as well
        auth.token = data.newToken;
        setLocalStorage("auth", auth);
        return axiosInstance(originalRequest);
      } else if (error.response.status === 401) {
        // logout user
        deleteLocalStorage("auth");
        window.location.reload();
      }
      return Promise.reject(error);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

const prepareImageSrc = (url) => `${BASE_URL}/${url}`;

export { prepareImageSrc, axiosInstance };
