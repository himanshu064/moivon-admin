import React from "react";
import {
  Box,
  Checkbox,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditMailModal from "./EditMailModel";
const MailTable = ({ mails = [], onDelete, selectedMail, setSelectedMail }) => {
  const allSelected = mails.every((mail) => selectedMail.includes(mail._id));
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
                      setSelectedMail(mails.map((mail) => mail._id));
                    } else {
                      setSelectedMail([]);
                    }
                  }}
                ></Checkbox>
              </Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mails.map((item, index) => {
              const { email, _id } = item;
              return (
                <Tr key={item._id}>
                  <Td>
                    <Checkbox
                      className="custom-checkbox"
                      isChecked={Boolean(
                        selectedMail.find((mail) => mail === _id)
                      )}
                      onChange={(e) => {
                        const { checked } = e.target;

                        if (checked) {
                          setSelectedMail((prev) => prev.concat(_id));
                        } else {
                          setSelectedMail((prev) =>
                            prev.filter((prevSelected) => prevSelected !== _id)
                          );
                        }
                      }}
                    ></Checkbox>
                  </Td>
                  <Td>{email}</Td>
                  <Td>
                    <div className="flex items-center actions-btn">
                      <EditMailModal mail={item} />
                      <ConfirmDialog
                        type="Mail"
                        onChildrenClick={() => onDelete(_id)}
                      >
                        <RiDeleteBinLine className="cursor-pointer hover:bg-red-500" />
                      </ConfirmDialog>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default MailTable;
