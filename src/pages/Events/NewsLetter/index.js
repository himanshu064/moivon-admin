import { Box, Stack, useQuery } from "@chakra-ui/react";
import React from "react";
import { Pagination } from "swiper";
import ConfirmDeleteMultiple from "../../../components/ConfirmDeleteMultiple";
import PageHeader from "../../../components/PageHeader";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import EventTable from "../ListEvent/EventTable";
import { ALL_ENDPOINTS } from "../../../api/endpoints";
import { fetchAllEmail } from "../../../services/events";

const NewsLetter = () => {
  const onDeleteMultiple = () => {};
  const onPageChange = () => {};
  return (
    <>
      <RouteTitle title="News Letter" />
      <Box>
        <Stack flexDir="column">
          <PageHeader front="" title="News Letter" />
          <div>
            <div className="deleteModal my-5">
              <ConfirmDeleteMultiple
                type="Multiple Events"
                onChildrenClick={onDeleteMultiple}
              >
                <button
                  type="button"
                  className="curson-pointer bg-red-600 hover:bg-red-500 text-white py-3 px-5"
                >
                  Delete Multiple
                </button>
              </ConfirmDeleteMultiple>
            </div>
            <div className="tab-panels">
              <React.Fragment>
                <EventTable />
              </React.Fragment>
            </div>
          </div>
        </Stack>
      </Box>
    </>
  );
};
export default NewsLetter;
