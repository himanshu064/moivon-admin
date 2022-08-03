import { axiosInstance } from "../api";
import { HEADERS } from "../constants";
import { ALL_ENDPOINTS } from "../api/endpoints";
import { objectToQueryParams } from "../utils/helpers";

export const fetchAllEvents = (data) => {
  const qs =
    data && Object.keys(data).length > 0 ? `?${objectToQueryParams(data)}` : "";
  return axiosInstance.get(
    `${ALL_ENDPOINTS.BUILD_GET_ALL_EVENTS()}${qs}`,
    HEADERS.jsonData
  );
};

export const deleteSingleEvent = (eventId) =>
  axiosInstance.delete(
    `${ALL_ENDPOINTS.BUILD_DELETE_EVENT(eventId)}`,
    HEADERS.jsonData
  );
