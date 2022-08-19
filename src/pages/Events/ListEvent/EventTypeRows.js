import React, { useState, useRef, useEffect } from "react";
import { Td, Checkbox } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PER_PAGE, START_PAGE, TAB_TYPES } from ".";
import toast from "react-hot-toast";
import { fetchAllEvents, updateSingleEvent } from "../../../services/events";
import { ALL_QUERIES } from "../../../api/endpoints";

const EventTypeRows = ({
  event,
  WrappingComponent = Td,
  mostPopularText = "",
  upcomingText = "",
  eventType = TAB_TYPES.all,
}) => {
  const [isMostPopular, setIsMostPopular] = useState(() => event.mostPopular);
  const [isUpcoming, setIsUpcoming] = useState(() => event.upComing);

  useEffect(() => {
    setIsMostPopular(event.mostPopular);
    setIsUpcoming(event.upComing);
  }, [event.mostPopular, event.upComing]);

  const queryClient = useQueryClient();
  const toastId = useRef();

  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { type = eventType, page = START_PAGE, size = PER_PAGE } = queryParams;

  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };
  const mutation = useMutation(
    (newQuery) =>
      updateSingleEvent({
        eventId: newQuery._id,
        images: newQuery.images,
        json_data: newQuery,
      }),
    {
      onSuccess: () => {
        removeExistingToasts();
        toastId.current = toast.success("Event type updated!");
        // refetch queries
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page, size })
        );
      },
    }
  );

  const onEventTypeChange = (_event, key, value) => {
    removeExistingToasts();
    // key can be upComing or mostPopular, value can be true or false
    if (key === "mostPopular") {
      // check total count!
      const data = queryClient.getQueryData(
        ALL_QUERIES.QUERY_ALL_EVENTS({ type, page })
      );
      if (data?.data?.totalMostPopular >= 3 && value) {
        toastId.current = toast.error(
          "Cannot add more than 3 events to most favorite!"
        );
        return;
      }
    }
    const setterFn = key === "mostPopular" ? setIsMostPopular : setIsUpcoming;
    setterFn(value);
    mutation.mutate({
      ..._event,
      genre: _event.genre?._id,
      startDate: _event.startDate,
      endDate: _event.endDate,
      [key]: value,
    });
  };

  return (
    <React.Fragment>
      <WrappingComponent className="text-center w-full">
        <Checkbox
          colorScheme="blue"
          isChecked={isMostPopular}
          onChange={(e) => {
            // setIsMostPopular(e.target.checked);
            onEventTypeChange(event, "mostPopular", e.target.checked);
          }}
        >
          {!mostPopularText
            ? event?.mostPopular
              ? "Yes"
              : "No"
            : mostPopularText}
        </Checkbox>
      </WrappingComponent>
      <WrappingComponent>
        <Checkbox
          colorScheme="green"
          isChecked={isUpcoming}
          onChange={(e) => {
            // setIsUpcoming(e.target.checked);
            onEventTypeChange(event, "upComing", e.target.checked);
          }}
        >
          {!upcomingText ? (event?.upComing ? "Yes" : "No") : upcomingText}
        </Checkbox>
      </WrappingComponent>
    </React.Fragment>
  );
};

export default EventTypeRows;
