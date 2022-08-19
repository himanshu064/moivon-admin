import { axiosInstance } from "../api";
import { ALL_ENDPOINTS } from "../api/endpoints";

export const fetchAllGenres = () => {
  return axiosInstance.get(ALL_ENDPOINTS.BUILD_ALL_GENRES());
};
