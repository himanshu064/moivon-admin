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

import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { prepareImageSrc } from "../../../api";
import { formatCurrency } from "../../../utils/helpers";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EditEventModal from "../EditEventModal";
import { MdOutlineArrowDropDown } from "react-icons/md";
import ChangeEventStatusPopup from "../../../components/ChangeEventStatusPopup";

const EventTable = ({
  events = [],
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  return (
    <Box w={{ base: "100%" }} bg={"white"}>
      <TableContainer
        style={{ border: "1px solid #eceff5", marginTop: "10px" }}
      >
        <Table size="sm" variant="simple" className="list-event">
          <Thead>
            <Tr>
              <Th>
                <Checkbox className="custom-checkbox"></Checkbox>
              </Th>
              <Th>Event</Th>
              <Th>Title</Th>
              <Th>Date</Th>
              <Th>Genre</Th>
              <Th>Price</Th>
              <Th>Location</Th>
              <Th>Description</Th>
              <Th>Venue</Th>
              <Th>Oranganisation</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map((data) => (
              <Tr key={data._id}>
                <Td>
                  <Checkbox className="custom-checkbox"></Checkbox>
                </Td>
                <Td>
                  <AvatarGroup size="md" max={2}>
                    {data.images.map((image, idx) => {
                      const src = prepareImageSrc(image);
                      return <Avatar key={`image_${idx}`} src={src} />;
                    })}
                  </AvatarGroup>
                </Td>
                <Td>{data?.title}</Td>
                <Td>
                  {format(
                    new Date(utcToZonedTime(data.dates, "utc")),
                    "dd LLL yyyy, hh:MM a"
                  )}
                </Td>
                <Td>{data?.genre}</Td>
                <Td>{formatCurrency(data?.price)}</Td>
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
                <Td>
                  <div className="flex items-center actions-btn">
                    <FaRegEye
                      className="cursor-pointer hover:bg-blue-800 mr-1"
                      onClick={onView}
                    />
                    <EditEventModal />
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
