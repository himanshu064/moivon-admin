import React, { useState, useRef } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RouteTitle from "../../components/RouteTitle/routeTitle";
import MailTable from "./MailTable";
import PageHeader from "../../components/PageHeader";
import ConfirmDeleteMultiple from "../../components/ConfirmDeleteMultiple";
import { fetchAllEmails, deleteMultpleMail } from "../../services/mail";
import Loader from "../../components/Loader";
import { toast } from "react-hot-toast";
import { NOTIFICATION_DURATION } from "../../constants";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { PER_PAGE, START_PAGE } from "../Events/ListEvent";
import { ALL_QUERIES } from "../../api/endpoints";
import Pagination from "rc-pagination";
const NewsLetter = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMail, setSelectedMail] = useState([]);
  const toastId = useRef("");
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };

  const commonErrorHandler = (error) => {
    removeExistingToasts();
    const err = error?.response?.data?.error;
    if (Array.isArray(err)) {
      const [originalError] = Object.values(err?.[0]);
      toastId.current = toast.error(originalError, NOTIFICATION_DURATION);
    } else if (typeof err === "string") {
      toastId.current = toast.error(err, NOTIFICATION_DURATION);
    } else {
      toastId.current = toast.error("Something went wrong!");
    }
  };
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { page = START_PAGE, size = PER_PAGE } = queryParams;

  //to get all email
  const {
    data: mailData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_MAILS({ page }), () =>
    fetchAllEmails({ page, size })
  );
  // to delete sigle mail
  const { mutate: onDeleteMailMutation } = useMutation(
    (id) => deleteMultpleMail([id]),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Deleted successfully");
        setSelectedMail([]);
        queryClient.refetchQueries(ALL_QUERIES.QUERY_ALL_MAILS({ page }), () =>
          fetchAllEmails({ page, size })
        );
        setTimeout(() => toast.remove(successId), 3000);
        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );
  // to delete multiple mail
  const { mutate: onMultipleDeleteMailMutation } = useMutation(
    () => deleteMultpleMail(selectedMail),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Multiple mails deleted successfully!");
        setSelectedMail([]);
        queryClient.refetchQueries(ALL_QUERIES.QUERY_ALL_MAILS({ page }), () =>
          fetchAllEmails({ page, size })
        );
        setTimeout(() => toast.remove(successId), 3000);
        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );

  const onDeleteMultipleMail = () => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting multiple...");
    onMultipleDeleteMailMutation();
  };

  const onDeleteMail = (id) => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting...");
    onDeleteMailMutation(id);
  };
  const onPageChange = (current, pageSize) => {
    setSelectedMail([]);
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        ...queryParams,
        page: current,
        size: pageSize,
      })}`,
    });
  };
  if (isLoading) return <Loader />;
  if (isError) return <h1>Error ={error.toString()}</h1>;
  return (
    <>
      <RouteTitle title="News Letter" />
      <Box>
        <Stack flexDir="column">
          <PageHeader front="" title="News Letter" />
          <div>
            {selectedMail.length > 1 && (
              <div className="deleteModal my-5">
                <ConfirmDeleteMultiple
                  type="Multiple Mail"
                  onChildrenClick={onDeleteMultipleMail}
                >
                  <button
                    type="button"
                    className="cursor-pointer bg-red-600 hover:bg-red-500 text-white py-3 px-5"
                  >
                    Delete Multiple
                  </button>
                </ConfirmDeleteMultiple>
              </div>
            )}
            <div className="tab-panels">
              {mailData?.data?.data?.length > 0 ? (
                <React.Fragment>
                  <MailTable
                    mails={mailData?.data?.data}
                    onDelete={onDeleteMail}
                    selectedMail={selectedMail}
                    setSelectedMail={(mails) => setSelectedMail(mails)}
                  />
                  <div className="text-right">
                    <Pagination
                      defaultCurrent={page}
                      pageSie={size}
                      showLessItems
                      totalBoundaryShowSizeChanger={3}
                      total={mailData?.data?.totalNewsLetters}
                      onChange={onPageChange}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                      }
                    />
                  </div>
                </React.Fragment>
              ) : (
                <div className="bg-white text-center mt-12">
                  <h3 className="font-bold">No data found!</h3>
                </div>
              )}
            </div>
          </div>
        </Stack>
      </Box>
    </>
  );
};
export default NewsLetter;
