import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import PageHeader from "../../../components/PageHeader";
import { FaRegEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const TableData = [
  {
    id: 1,
    title: "Classic",
    date: "12/01/2022",
    genre: "Feature Venue",
    price: "500",
    location: "40 Bourbon",
    desc: "Lorem ipsum lorem ipsum lorem ipsum",
    venue: " Birthday event",
    orgn: "Lorem ipsum lorem ipsum lorem ipsum",
  },
  {
    id: 2,
    title: "Classic",
    date: "12/01/2022",
    genre: "Feature Venue",
    price: "500",
    location: "40 Bourbon",
    desc: "Lorem ipsum lorem ipsum lorem ipsum",
    venue: " Birthday event",
    orgn: "Lorem ipsum lorem ipsum lorem ipsum",
  },
  {
    id: 3,
    title: "Classic",
    date: "12/01/2022",
    genre: "Feature Venue",
    price: "500",
    location: "40 Bourbon",
    desc: "Lorem ipsum lorem ipsum lorem ipsum",
    venue: " Birthday event",
    orgn: "Lorem ipsum lorem ipsum lorem ipsum",
  },
  {
    id: 4,
    title: "Classic",
    date: "12/01/2022",
    genre: "Feature Venue",
    price: "500",
    location: "40 Bourbon",
    desc: "Lorem ipsum lorem ipsum lorem ipsum",
    venue: " Birthday event",
    orgn: "Lorem ipsum lorem ipsum lorem ipsum",
  },
];

const ListEvent = () => {
  return (
    <>
      <Box px={{ md: "20px" }}>
        <Stack flexDir="column">
          <PageHeader title="List Event" />
          <div className="py-10">
            <Tabs>
              <TabList
                className="customTabs"
                style={{
                  padding: "1rem",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              >
                <Tab>All Events</Tab>
                <Tab>Pending</Tab>
                <Tab>Approved</Tab>
              </TabList>

              <TabPanels className="tab-panels">
                <TabPanel>
                  <Box
                    w={{ base: "100%" }}
                    bg={"white"}
                    borderRadius="10px"
                    padding="30px 0"
                  >
                    <TableContainer>
                      <Table size="md" variant="striped" className="list-event">
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
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {TableData.map((data) => (
                            <Tr key={data.id}>
                              <Td>
                                <Checkbox className="custom-checkbox"></Checkbox>
                              </Td>
                              <Td>
                                <AvatarGroup size="md" max={2}>
                                  <Avatar
                                    name="Ryan Florence"
                                    src="https://bit.ly/ryan-florence"
                                  />
                                  <Avatar
                                    name="Segun Adebayo"
                                    src="https://bit.ly/sage-adebayo"
                                  />
                                  <Avatar
                                    name="Kent Dodds"
                                    src="https://bit.ly/kent-c-dodds"
                                  />
                                  <Avatar
                                    name="Prosper Otemuyiwa"
                                    src="https://bit.ly/prosper-baba"
                                  />
                                  <Avatar
                                    name="Christian Nwamba"
                                    src="https://bit.ly/code-beast"
                                  />
                                </AvatarGroup>
                              </Td>
                              <Td>{data?.title}</Td>
                              <Td>{data?.date}</Td>
                              <Td>{data?.genre}</Td>
                              <Td>{data?.price}</Td>
                              <Td>
                                <Text> {data?.location}</Text>
                              </Td>
                              <Td>
                                <Text>{data?.desc}</Text>
                              </Td>
                              <Td>
                                <Text> {data?.venue}</Text>
                              </Td>
                              <Td>
                                <Text> {data?.orgn}</Text>
                              </Td>
                              <Td>
                                <div className="flex gap-1 items-center actions-btn">
                                  <FaRegEye />
                                  <FaRegEdit />
                                  <RiDeleteBinLine />
                                </div>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Stack>
      </Box>
    </>
  );
};

export default ListEvent;
