import React, { useState, useRef } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import MailTable from "./MailTable";
import PageHeader from "../../../components/PageHeader";
import ConfirmDeleteMultiple from "../../../components/ConfirmDeleteMultiple";
import {
  fetchAllEmails,
  deleteSingleMail,
  deleteMultpleMail,
} from "../../../services/mail";
import Loader from "../../../components/Loader";
import { toast } from "react-hot-toast";
import { NOTIFICATION_DURATION } from "../../../constants";
import { useSearchParams } from "react-router-dom";
import { PER_PAGE, START_PAGE } from "../ListEvent";
import { ALL_QUERIES } from "../../../api/endpoints";
import Pagination from "rc-pagination";
const NewsLetter = () => {
  const [searchParams] = useSearchParams();
  const [selectedMail, setSelectedMail] = useState([]);
  const queryClient = useQueryClient();
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
  } = useQuery(ALL_QUERIES.QUERY_ALL_MAILS({ page, size }), () =>
    fetchAllEmails({ page, size })
  );
  // to delete sigle mail
  const { mutate: onDeleteMailMutation } = useMutation(
    (mailId) => deleteSingleMail(mailId),
    {
      onSuccess: () => {
        removeExistingToasts();
        toastId.current = toast.success(
          "Deleted successfully",
          NOTIFICATION_DURATION
        );
        selectedMail([]);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_MAILS({ page, size }),
          () => fetchAllEmails({ page, size })
        );
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
        toastId.current = toast.success(
          "Multiple mails deleted successfully!",
          NOTIFICATION_DURATION
        );
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_MAILS({ page, size }),
          () => fetchAllEmails({ page, size })
        );
        setSelectedMail([]);

        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );

  const onDeleteMultiple = () => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting multiple...");
    onMultipleDeleteMailMutation();
  };

  const onDeleteMail = (mailId) => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting...");
    onDeleteMailMutation(mailId);
  };
  const onPageChange = () => {};
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
                  onChildrenClick={onDeleteMultiple}
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
                    setSelectedMail={(mail) => setSelectedMail(mail)}
                  />
                  <div className="text-right">
                    <Pagination
                      defaultCurrent={page}
                      pageSie={size}
                      showLessItems
                      totalBoundaryShowSizeChanger={3}
                      total={mailData?.data?.data?.length}
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
