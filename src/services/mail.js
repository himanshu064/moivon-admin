import { axiosInstance } from "../api";
import { ALL_ENDPOINTS } from "../api/endpoints";
import { PER_PAGE } from "../pages/Events/ListEvent";
export const fetchAllEmails = ({ page, size = PER_PAGE }) => {
  return axiosInstance.get(ALL_ENDPOINTS.BUILD_ALL_NEWSLETTER({ page, size }));
};
// export const deleteSingleMail = (id) => {
//   axiosInstance.delete(`${ALL_ENDPOINTS.BUILD_DELETE_MAIL(id)}`);
// };
export const deleteMultpleMail = (mails) => {
  axiosInstance.post(`${ALL_ENDPOINTS.BUILD_DELETE_MULTIPLE_MAIL()}`, {
    ids: mails,
  });
};
export const updateMailEvent = ({ mailId, email }) => {
  return axiosInstance.put(`${ALL_ENDPOINTS.BUILD_UPDATE_MAIL(mailId)}`, email);
};
