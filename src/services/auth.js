import { axiosInstance } from "../api";
import { HEADERS } from "../constants";
import { ALL_ENDPOINTS } from "../api/endpoints";

export const login = (data) => {
  return axiosInstance.post(
    ALL_ENDPOINTS.BUILD_LOGIN(),
    data,
    HEADERS.jsonData
  );
};

export const register = (data) => {
  return axiosInstance.post(
    ALL_ENDPOINTS.BUILD_REGISTER(),
    data,
    HEADERS.jsonData
  );
};
