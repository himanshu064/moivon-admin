import React from "react";
import {
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Tbody,
  Td,
  AvatarGroup,
  Avatar,
  Text,
  Highlight,
} from "@chakra-ui/react";
import { createSearchParams, Link, useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { prepareImageSrc } from "../../../api";
import {
  formatCurrency,
  getPaginatedRecordNumber,
} from "../../../utils/helpers";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EditEventModal from "../EditEventModal";
import { MdOutlineArrowDropDown } from "react-icons/md";
import ChangeEventStatusPopup from "../../../components/ChangeEventStatusPopup";
import EventTypeRows from "./EventTypeRows";
import { useLocation } from "react-router-dom";
import { EVENT_TABLES, TAB_TYPES } from ".";
import SortColumn from "./SortColumn";

const EventTable = ({
  events = [],
  onStatusChange,
  onDelete,
  selectedEvents,
  setSelectedEvents,
  eventType = TAB_TYPES.all,
  onSortColumn,
  tableType,
}) => {
  const allSelected = events.every((event) =>
    selectedEvents.includes(event._id)
  );

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { sortBy = "", orderBy = "" } = queryParams;

  const getSortOrder = (key) => {
    if (sortBy !== key) {
      return "";
    }

    if (sortBy === key && orderBy === "asc") {
      return "asc";
    } else if (sortBy === key && orderBy === "desc") {
      return "desc";
    }
  };

  return (
    <Box w={{ base: "100%" }} bg={"white"}>
      <TableContainer
        style={{ border: "1px solid #eceff5", marginTop: "10px" }}
      >
        <Table size="sm" variant="simple" className="list-event">
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  className="custom-checkbox"
                  isChecked={allSelected}
                  onChange={(e) => {
                    const { checked } = e.target;
                    if (checked) {
                      setSelectedEvents(events.map((event) => event._id));
                    } else {
                      setSelectedEvents([]);
                    }
                  }}
                ></Checkbox>
              </Th>
              {tableType && <Th>Sequence No.</Th>}
              <Th>Event</Th>
              <SortColumn
                name="Title"
                sortBy="title"
                orderBy={getSortOrder("title")}
                onSort={onSortColumn}
              />
              {/* <Th>Event</Th> */}
              <SortColumn
                name="Start Date"
                sortBy="startDate"
                orderBy={getSortOrder("startDate")}
                onSort={onSortColumn}
              />
              {/* <Th>Start Date</Th> */}
              <Th>End Date</Th>
              <SortColumn
                name="Genre"
                sortBy="genre"
                orderBy={getSortOrder("genre")}
                onSort={onSortColumn}
              />
              {/* <Th>Genre</Th> */}
              <SortColumn
                name="Price"
                sortBy="price"
                orderBy={getSortOrder("price")}
                onSort={onSortColumn}
              />
              {/* <Th>Price</Th> */}
              <Th>Location</Th>
              <Th>Event Description</Th>
              <SortColumn
                name="Venue"
                sortBy="venue"
                orderBy={getSortOrder("venue")}
                onSort={onSortColumn}
              />
              {/* <Th>Venue</Th> */}
              <Th>Oranganisation</Th>
              <Th>Oranganisation URL</Th>
              <Th>Oranganisation Description</Th>
              <Th>Event URL</Th>
              <Th>Status</Th>
              <Th>Most Popular</Th>
              <Th>Upcoming</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map((data, idx) => (
              <Tr key={data._id}>
                <Td>
                  <Checkbox
                    isChecked={Boolean(
                      selectedEvents.find((event) => event === data._id)
                    )}
                    onChange={(e) => {
                      const { checked } = e.target;

                      if (checked) {
                        setSelectedEvents((prev) => prev.concat(data._id));
                      } else {
                        setSelectedEvents((prev) =>
                          prev.filter(
                            (prevSelected) => prevSelected !== data._id
                          )
                        );
                      }
                    }}
                    className="custom-checkbox"
                  ></Checkbox>
                </Td>
                {/* <Td>
                  {getPaginatedRecordNumber({
                    page: currentPage,
                    index: idx,
                    per_page: PER_PAGE,
                  })}
                </Td> */}
                {tableType && tableType === EVENT_TABLES.popular && (
                  <Td>{data.mostPopularSeq || "-"}</Td>
                )}
                {tableType && tableType === EVENT_TABLES.upcoming && (
                  <Td>{data.upComingSeq || "-"}</Td>
                )}
                <Td>
                  <AvatarGroup size="md" max={2}>
                    {data.images.map((img, idx) => {
                      const src = prepareImageSrc(img.image);
                      return <Avatar key={`image_${idx}`} src={src} />;
                    })}
                  </AvatarGroup>
                </Td>
                <Td>
                  <Text>{data?.title}</Text>
                </Td>
                <Td>
                  {data?.startDate &&
                    format(parseISO(data.startDate), "dd MMM yyyy, hh:mm a")}
                </Td>
                <Td>
                  {data?.endDate &&
                    format(parseISO(data.endDate), "dd MMM yyyy, hh:mm a")}
                </Td>
                <Td>{data?.genre?.genre}</Td>
                <Td>
                  {data?.price !== 0 ? formatCurrency(data?.price) : "FREE"}
                </Td>
                <Td>
                  <Text> {data.location}</Text>
                </Td>
                <Td>
                  <Text>{data.description}</Text>
                </Td>
                <Td>
                  <Text> {data.venue}</Text>
                </Td>
                <Td>
                  <Text>{data.organization}</Text>
                </Td>
                <Td>
                  <Text>{data.organizationUrl}</Text>
                </Td>
                <Td>
                  <Text> {data?.eventOrgDetail}</Text>
                </Td>
                <Td>
                  <Text> {data?.eventUrl}</Text>
                </Td>
                <Td>
                  <ChangeEventStatusPopup
                    onStatusChange={(status) =>
                      onStatusChange(data?._id, status)
                    }
                  >
                    <div className="flex items-center gap-x-1 cursor-pointer">
                      <Highlight
                        query={data.published ? "Approved" : "Pending"}
                        styles={{
                          px: "1.5",
                          py: "1.5",
                          bg: data.published ? "green.200" : "orange.200",
                          fontWeight: 500,
                        }}
                      >
                        {data.published ? "Approved" : "Pending"}
                      </Highlight>
                      <MdOutlineArrowDropDown size={24} />
                    </div>
                  </ChangeEventStatusPopup>
                </Td>
                <EventTypeRows event={data} eventType={eventType} />
                <Td>
                  <div className="flex items-center actions-btn">
                    <Link to={`${location.pathname}/${data._id}`}>
                      <FaRegEye className="cursor-pointer hover:bg-blue-800 mr-1" />
                    </Link>
                    <EditEventModal
                      event={data}
                      eventType={eventType}
                      tableType={tableType}
                    />
                    <ConfirmDialog
                      type="Event"
                      onChildrenClick={() => onDelete(data._id)}
                    >
                      <RiDeleteBinLine className="cursor-pointer hover:bg-red-500" />
                    </ConfirmDialog>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EventTable;
