import React, { useState, useRef } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "rc-pagination";
import { toast } from "react-hot-toast";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ALL_QUERIES } from "../../../api/endpoints";
import { EVENT_STATUS, NOTIFICATION_DURATION } from "../../../constants";
import {
  deleteMultipleEvent,
  deleteSingleEvent,
  fetchAllEvents,
  updateEventStatus,
} from "../../../services/events";
import { PER_PAGE, START_PAGE } from "../ListEvent";
import EventTable from "../ListEvent/EventTable";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import Loader from "../../../components/Loader";
import PageHeader from "../../../components/PageHeader";
import ConfirmDeleteMultiple from "../../../components/ConfirmDeleteMultiple";

const UpcomingEvents = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [selectedEvents, setSelectedEvents] = useState([]);

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
  const { type = "upcoming", page = START_PAGE, size = PER_PAGE } = queryParams;
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }), () =>
    fetchAllEvents({ type, page, size })
  );

  const { mutate: changeStatusMutation } = useMutation(
    ({ id, isPublished }) =>
      updateEventStatus({
        eventId: id,
        isPublished: isPublished,
      }),
    {
      onSuccess: () => {
        removeExistingToasts();
        toastId.current = toast.success(
          "Event status updated successfully!",
          NOTIFICATION_DURATION
        );
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );

  const { mutate: onDeleteMutation } = useMutation(
    (eventId) => deleteSingleEvent(eventId),
    {
      onSuccess: () => {
        removeExistingToasts();
        toastId.current = toast.success(
          "Deleted successfully!",
          NOTIFICATION_DURATION
        );
        setSelectedEvents([]);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );

  const onStatusChange = (id, status) => {
    removeExistingToasts();
    const isPublished = status === EVENT_STATUS.PUBLISH;
    toastId.current = toast.loading("Updating...");
    changeStatusMutation({
      id,
      isPublished,
    });
  };

  const onDeleteEvent = (eventId) => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting...");
    onDeleteMutation(eventId);
  };

  const onPageChange = (current, pageSize) => {
    // change the route
    setSelectedEvents([]);
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        ...queryParams,
        page: current,
        size: pageSize,
      })}`,
    });
  };

  const { mutate: onMultipleDeleteMutation } = useMutation(
    () => deleteMultipleEvent(selectedEvents),
    {
      onSuccess: () => {
        removeExistingToasts();
        toastId.current = toast.success(
          "Multiple events deleted successfully!",
          NOTIFICATION_DURATION
        );
        setSelectedEvents([]);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );

  const onDeleteMultiple = () => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting multiple...");
    onMultipleDeleteMutation();
  };

  if (isLoading) return <Loader />;
  if (isError) return <h1>Error = {error.toString()}</h1>;

  return (
    <>
      <RouteTitle title="Upcoming Events" />
      <Box>
        <Stack flexDir="column">
          <PageHeader front="" title="Upcoming Events" />
          <div>
            {selectedEvents.length > 1 && (
              <div className="deleteModal my-5">
                <ConfirmDeleteMultiple
                  type="Multiple Events"
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
          </div>
          <div className="tab-panels">
            {eventsData?.data?.data?.length > 0 ? (
              <React.Fragment>
                <EventTable
                  events={eventsData?.data?.data}
                  onDelete={onDeleteEvent}
                  onStatusChange={onStatusChange}
                  selectedEvents={selectedEvents}
                  setSelectedEvents={(events) => setSelectedEvents(events)}
                  eventType={type}
                />
                <div className="text-right">
                  <Pagination
                    defaultCurrent={page}
                    pageSize={size}
                    showLessItems
                    totalBoundaryShowSizeChanger={3}
                    total={eventsData?.data?.totalEvent}
                    onChange={onPageChange}
                    showTotal={(total, range) =>
                      `${range[0]} - ${range[1]} of ${total} items`
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
        </Stack>
      </Box>
    </>
  );
};

export default UpcomingEvents;
