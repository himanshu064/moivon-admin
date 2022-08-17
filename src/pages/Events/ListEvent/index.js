import React, { useRef, useState } from "react";
import { Box, Select, Stack, Tab, TabList, Tabs } from "@chakra-ui/react";
import Pagination from "rc-pagination";
import PageHeader from "../../../components/PageHeader";
import Loader from "../../../components/Loader";
import EventTable from "./EventTable";
import { ALL_QUERIES } from "../../../api/endpoints";
import {
  deleteSingleEvent,
  fetchAllEvents,
  updateEventStatus,
  deleteMultipleEvent,
} from "../../../services/events";
import { EVENT_STATUS, NOTIFICATION_DURATION } from "../../../constants";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
  useLocation,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import ConfirmDeleteMultiple from "../../../components/ConfirmDeleteMultiple";

export const TAB_TYPES = {
  all: "all",
  pending: "pending",
  approved: "approved",
  popular: "popular",
  upcoming: "upcoming",
};

export const START_PAGE = 1;
export const PER_PAGE = 10;

const getTabTypesFromIndex = (index) => Object.keys(TAB_TYPES)[index];
const getTabIndexFromTabType = (type) =>
  Object.keys(TAB_TYPES).findIndex((tabType) => tabType === type) || 0;

const ListEvent = ({ onDelete }) => {
  const toastId = useRef("");
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const {
    type = TAB_TYPES.all,
    page = START_PAGE,
    size = PER_PAGE,
  } = queryParams;

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedEvents, setSelectedEvents] = useState([]);

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }), () =>
    fetchAllEvents({ type, page, size })
  );

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

  const onStatusChange = (id, status) => {
    removeExistingToasts();
    const isPublished = status === EVENT_STATUS.PUBLISH;
    toastId.current = toast.loading("Updating...");
    changeStatusMutation({
      id,
      isPublished,
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <h1>Error = {error.toString()}</h1>;

  const onDeleteEvent = (eventId) => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting...");
    onDeleteMutation(eventId);
  };

  const onDeleteMultiple = () => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting multiple...");
    onMultipleDeleteMutation();
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

  return (
    <>
      <RouteTitle title="List Event" />
      <Box>
        <Stack flexDir="column">
          <PageHeader title="List Event" />
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
            <Tabs
              index={getTabIndexFromTabType(type)}
              onChange={(index) => {
                navigate({
                  pathname: location.pathname,
                  search: `?${createSearchParams({
                    ...queryParams,
                    type: getTabTypesFromIndex(index),
                    page: 1,
                    size,
                  })}`,
                });
                setSelectedEvents([]);
              }}
            >
              <TabList className="customTabs">
                {Object.keys(TAB_TYPES).map((tab, index) => (
                  <Tab key={`tab_${index}`} className="capitalize">
                    {tab}
                  </Tab>
                ))}
              </TabList>
              <div className="tab-panels">
                {eventsData?.data?.data?.length > 0 ? (
                  <React.Fragment>
                    <EventTable
                      events={eventsData?.data?.data}
                      onDelete={onDeleteEvent}
                      onStatusChange={onStatusChange}
                      selectedEvents={selectedEvents}
                      setSelectedEvents={(events) => setSelectedEvents(events)}
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
            </Tabs>
          </div>
        </Stack>
      </Box>
    </>
  );
};

export default ListEvent;
