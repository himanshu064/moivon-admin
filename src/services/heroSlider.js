import { axiosInstance } from "../api";
import { HEADERS } from "../constants";
import { ALL_ENDPOINTS } from "../api/endpoints";
import { HERO_SLIDER_PER_PAGE } from "../pages/HeroSlider/SliderList";

export const createHeroSlider = ({ json_data, images }) => {
  const formData = new FormData();
  // append multiple images
  images.forEach((image) => formData.append("image", image));

  Object.entries(json_data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return axiosInstance.post(
    `${ALL_ENDPOINTS.BUILD_CREATE_HERO_SLIDER()}`,
    formData,
    HEADERS.formData
  );
};

export const fetchAllHeroSliders = ({ page, size = HERO_SLIDER_PER_PAGE }) => {
  return axiosInstance.get(
    `${ALL_ENDPOINTS.BUILD_GET_ALL_HERO_SLIDER({ page, size })}`
  );
};

export const deleteHeroSlider = (sliderId) =>
  axiosInstance.delete(`${ALL_ENDPOINTS.BUILD_DELETE_HERO_SLIDER(sliderId)}`);

export const deleteHeroSliderImage = ({ imageId, eventId }) =>
  axiosInstance.delete(
    `${ALL_ENDPOINTS.BUILD_DELETE_HERO_SLIDER_IMAGE({ imageId, eventId })}`
  );

export const updateHeroSlider = ({ sliderId, json_data, images }) => {
  const formData = new FormData();
  // append multiple images
  images.forEach((image) => formData.append("image", image));

  Object.entries(json_data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return axiosInstance.put(
    `${ALL_ENDPOINTS.BUILD_UPDATE_HERO_SLIDER(sliderId)}`,
    formData,
    HEADERS.formData
  );
};
