import React, { useRef } from "react";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Stack, Tab, TabList, Tabs } from "@chakra-ui/react";
import PageHeader from "../../../components/PageHeader";
import EventTable from "./EventTable";
import { ALL_ENDPOINTS, ALL_QUERIES } from "../../../api/endpoints";
import { deleteSingleEvent, fetchAllEvents } from "../../../services/events";
import { NOTIFICATION_DURATION } from "../../../constants";

const TAB_TYPES = {
  all: "all",
  pending: "pending",
  approved: "approved",
};

const getTabTypesFromIndex = (index) => Object.keys(TAB_TYPES)[index];
const getTabIndexFromTabType = (type) =>
  Object.keys(TAB_TYPES).findIndex((tabType) => tabType === type) || 0;

const ListEvent = () => {
  const toastId = useRef("");
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { type = TAB_TYPES.all } = queryParams;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_EVENTS(), () =>
    fetchAllEvents({
      published: type === TAB_TYPES,
    })
  );

  const { mutate: onDeleteMutation } = useMutation(
    (eventId) => deleteSingleEvent(eventId),
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        toast.success("Deleted successfully!", NOTIFICATION_DURATION);
        queryClient.refetchQueries(ALL_QUERIES.QUERY_ALL_EVENTS(type));
      },
      onError: (error) => {
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
      },
    }
  );

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error = {error.toString()}</h1>;
  console.log({ eventsData, isLoading, isError, error });

  const onDeleteEvent = (eventId) => {
    toastId.current = toast.loading("Deleting...");
    onDeleteMutation(eventId);
  };

  return (
    <>
      <Box px={{ md: "20px" }}>
        <Stack flexDir="column">
          <PageHeader title="List Event" />
          <div className="py-10">
            <Tabs
              index={getTabIndexFromTabType(type)}
              onChange={(index) =>
                navigate({
                  pathname: window.location.pathname,
                  search: `?${createSearchParams({
                    ...queryParams,
                    type: getTabTypesFromIndex(index),
                  })}`,
                })
              }
            >
              <TabList
                className="customTabs"
                style={{
                  padding: "1rem",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              >
                {Object.keys(TAB_TYPES).map((tab, index) => (
                  <Tab key={`tab_${index}`} className="capitalize">
                    {tab}
                  </Tab>
                ))}
              </TabList>
              <div className="tab-panels">
                {eventsData?.data?.data?.length > 0 ? (
                  <EventTable
                    events={eventsData?.data?.data}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={onDeleteEvent}
                  />
                ) : (
                  <div className="bg-white text-center">
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
