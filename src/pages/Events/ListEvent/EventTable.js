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
import { Link } from "react-router-dom";
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
import { PER_PAGE, TAB_TYPES } from ".";

const EventTable = ({
  events = [],
  onStatusChange,
  onDelete,
  selectedEvents,
  setSelectedEvents,
  eventType = TAB_TYPES.all,
  currentPage = 1,
}) => {
  const allSelected = events.every((event) =>
    selectedEvents.includes(event._id)
  );

  const location = useLocation();

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
              <Th>No.</Th>
              <Th>Event</Th>
              <Th>Title</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Genre</Th>
              <Th>Price</Th>
              <Th>Location</Th>
              <Th>Description</Th>
              <Th>Venue</Th>
              <Th>Oranganisation</Th>
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
                <Td>
                  {getPaginatedRecordNumber({
                    page: currentPage,
                    index: idx,
                    per_page: PER_PAGE,
                  })}
                </Td>
                <Td>
                  <AvatarGroup size="md" max={2}>
                    {data.images.map((img, idx) => {
                      const src = prepareImageSrc(img.image);
                      return <Avatar key={`image_${idx}`} src={src} />;
                    })}
                  </AvatarGroup>
                </Td>
                <Td>{data?.title}</Td>
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
                  <Text> {data?.eventOrgDetail}</Text>
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
                    <EditEventModal event={data} eventType={eventType} />
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
