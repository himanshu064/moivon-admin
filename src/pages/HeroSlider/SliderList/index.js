import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import PageHeader from "../../../components/PageHeader";

import RouteTitle from "../../../components/RouteTitle/routeTitle";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  AvatarGroup,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function SliderList() {
  return (
    <>
      <RouteTitle title="List Event" />
      <Box>
        <Stack flexDir="column">
          <PageHeader title="List Slider" />
          <div>
            <Box w={{ base: "100%" }} bg={"white"}>
              <TableContainer
                style={{ border: "1px solid #eceff5", marginTop: "10px" }}
              >
                <Table size="sm" variant="simple" className="list-event">
                  <Thead>
                    <Tr>
                      <Th>Images</Th>
                      <Th>Text</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
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

                      <Td>
                        <Text> 2jj</Text>
                      </Td>
                      <Td>Approved</Td>
                      <Td>
                        <div className="flex items-center actions-btn">
                          <FaRegEye className="cursor-pointer hover:bg-blue-800 mr-1" />
                          <FaRegEye />
                          <FaRegEye />
                        </div>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </div>
        </Stack>
      </Box>
    </>
  );
}

export default SliderList;
