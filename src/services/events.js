import { axiosInstance } from "../api";
import { HEADERS } from "../constants";
import { ALL_ENDPOINTS } from "../api/endpoints";
import { PER_PAGE } from "../pages/Events/ListEvent";

export const fetchAllEvents = ({
  page,
  type,
  size = PER_PAGE,
  sort = "",
  order = "",
}) => {
  return axiosInstance.get(
    `${ALL_ENDPOINTS.BUILD_GET_ALL_EVENTS({ page, type, size, sort, order })}`
  );
};

export const deleteSingleEvent = (eventId) =>
  axiosInstance.delete(`${ALL_ENDPOINTS.BUILD_DELETE_EVENT(eventId)}`);

export const deleteMultipleEvent = (events) =>
  axiosInstance.post(`${ALL_ENDPOINTS.BUILD_MULTIPLE_DELETE_EVENT()}`, {
    eventIds: events,
  });

export const updateEventStatus = ({ eventId, isPublished }) =>
  axiosInstance.put(`${ALL_ENDPOINTS.BUILD_UPDATE_EVENT_STATUS(eventId)}`, {
    published: isPublished,
  });

export const fetchSingleEvent = (eventId) =>
  axiosInstance.get(`${ALL_ENDPOINTS.BUILD_GET_SINGLE_EVENT(eventId)}`);

export const updateSingleEvent = ({ eventId, json_data, images }) => {
  const formData = new FormData();
  // append multiple images
  images.forEach((image) => formData.append("image", image));

  Object.entries(json_data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return axiosInstance.put(
    `${ALL_ENDPOINTS.BUILD_GET_SINGLE_EVENT(eventId)}`,
    formData,
    HEADERS.formData
  );
};

export const deleteEventImage = ({ imageId, eventId }) =>
  axiosInstance.delete(
    `${ALL_ENDPOINTS.BUILD_DELETE_EVENT_IMAGE({ imageId, eventId })}`
  );
