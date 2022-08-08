import axios from "axios";
import { HEADERS } from "../constants";
import { getLocalStorage } from "../utils/localStorage";

export const BASE_URL = process.env.REACT_APP_BASE_API_URL;
const API_BASE_URL = `${BASE_URL}`;

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

const prepareImageSrc = (url) => `${BASE_URL}/${url}`;

export { prepareImageSrc, axiosInstance };
