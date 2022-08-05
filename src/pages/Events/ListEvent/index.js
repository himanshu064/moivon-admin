import React, { useRef } from "react";
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
} from "../../../services/events";
import { EVENT_STATUS, NOTIFICATION_DURATION } from "../../../constants";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@chakra-ui/react";

export const TAB_TYPES = {
  all: "all",
  pending: "pending",
  approved: "approved",
};

export const START_PAGE = 1;
const PER_PAGE = 10;

const getTabTypesFromIndex = (index) => Object.keys(TAB_TYPES)[index];
const getTabIndexFromTabType = (type) =>
  Object.keys(TAB_TYPES).findIndex((tabType) => tabType === type) || 0;

const ListEvent = () => {
  const toastId = useRef("");
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { type = TAB_TYPES.all, page = START_PAGE } = queryParams;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }), () =>
    fetchAllEvents({ type, page })
  );

  const commonErrorHandler = (error) => {
    toast.remove(toastId.current);
    const err = error?.response?.data?.error;
    if (Array.isArray(err)) {
      const [originalError] = Object.values(err?.[0]);
      toast.error(originalError, NOTIFICATION_DURATION);
    } else if (typeof err === "string") {
      toast.error(err, NOTIFICATION_DURATION);
    } else {
      toast.error("Something went wrong!");
    }
  };

  const { mutate: onDeleteMutation } = useMutation(
    (eventId) => deleteSingleEvent(eventId),
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        toast.success("Deleted successfully!", NOTIFICATION_DURATION);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
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
        toast.remove(toastId.current);
        toast.success(
          "Event status updated successfully!",
          NOTIFICATION_DURATION
        );
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
      },
      onError: commonErrorHandler,
    }
  );

  const onStatusChange = (id, status) => {
    const isPublished = status === EVENT_STATUS.PUBLISH;
    toastId.current = toast.loading("Updating...");
    changeStatusMutation({
      id,
      isPublished,
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <h1>Error = {error.toString()}</h1>;
  console.log({ eventsData, isLoading, isError, error });

  const onDeleteEvent = (eventId) => {
    toastId.current = toast.loading("Deleting...");
    onDeleteMutation(eventId);
  };

  const onPageChange = (current, pageSize) => {
    // change the route
    navigate({
      pathname: window.location.pathname,
      search: `?${createSearchParams({
        ...queryParams,
        page: current,
      })}`,
    });
  };

  return (
    <>
      <Box>
        <Stack flexDir="column">
          <PageHeader title="List Event" />
          <div>
            <Tabs
              index={getTabIndexFromTabType(type)}
              onChange={(index) =>
                navigate({
                  pathname: window.location.pathname,
                  search: `?${createSearchParams({
                    ...queryParams,
                    type: getTabTypesFromIndex(index),
                    page: 1,
                  })}`,
                })
              }
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
                      onView={() => {}}
                      onEdit={() => {}}
                      onDelete={onDeleteEvent}
                      onStatusChange={onStatusChange}
                    />
                    <div className="text-right">
                      <Pagination
                        defaultCurrent={page}
                        pageSize={PER_PAGE}
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
