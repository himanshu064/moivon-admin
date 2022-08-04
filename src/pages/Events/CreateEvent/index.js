import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import DatePicker from "react-datepicker";
import styles from "./index.module.css";

const CreateEvent = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <>
      <Box px={{ md: "20px" }}>
        <Stack flexDir="column">
          <PageHeader title="Create Event" />
          <div className="form-div py-10">
            <Box
              w={{ base: "100%" }}
              bg={"white"}
              borderRadius="10px"
              padding="30px"
            >
              <form className={styles.createForm}>
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>TITLE:</FormLabel>
                      <Input />
                    </FormControl>
                  </Box>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>UPLOAD EVENT:</FormLabel>
                      <Input type="file" style={{ paddingTop: "4px" }} />
                    </FormControl>
                  </Box>
                </Stack>
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>DATE:</FormLabel>
                      <DatePicker
                        className={styles.datePicker}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                      />
                    </FormControl>
                  </Box>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>GENRE:</FormLabel>
                      <Select placeholder="Select option">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>PRICE:</FormLabel>
                      <Input />
                    </FormControl>
                  </Box>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>LOCATION:</FormLabel>
                      <Input />
                    </FormControl>
                  </Box>
                </Stack>
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w="100%">
                    <FormControl isRequired>
                      <FormLabel>DESCRIPTION:</FormLabel>
                      <Textarea />
                    </FormControl>
                  </Box>
                </Stack>
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>VENUE:</FormLabel>
                      <Input />
                    </FormControl>
                  </Box>
                </Stack>
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w="100%">
                    <FormControl isRequired>
                      <FormLabel>DESCRIBE YOUR EVENT ORGANIZATION:</FormLabel>
                      <Textarea />
                    </FormControl>
                  </Box>
                </Stack>
                <Button size="lg" className="bg-primary text-white">
                  Create Event
                </Button>
              </form>
            </Box>
          </div>
        </Stack>
      </Box>
    </>
  );
};

export default CreateEvent;
