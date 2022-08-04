import { axiosInstance } from "../api";
import { HEADERS } from "../constants";
import { ALL_ENDPOINTS } from "../api/endpoints";

export const fetchAllEvents = ({ page, type }) => {
  return axiosInstance.get(
    `${ALL_ENDPOINTS.BUILD_GET_ALL_EVENTS({ page, type })}`,
    HEADERS.jsonData
  );
};

export const deleteSingleEvent = (eventId) =>
  axiosInstance.delete(
    `${ALL_ENDPOINTS.BUILD_DELETE_EVENT(eventId)}`,
    HEADERS.jsonData
  );

export const updateEventStatus = ({ eventId, isPublished }) =>
  axiosInstance.put(
    `${ALL_ENDPOINTS.BUILD_UPDATE_EVENT_STATUS(eventId)}`,
    {
      published: isPublished,
    },
    HEADERS.jsonData
  );
