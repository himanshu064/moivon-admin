import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import PageHeader from "../../../components/PageHeader";
import styles from "./index.module.css";

const CreateSlider = () => {
  // const [startDate, setStartDate] = useState(new Date());
  return (
    <>
      <Box px={{ md: "20px" }}>
        <Stack flexDir="column">
          <PageHeader title="Create Slider" />
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
                    <FormControl>
                      <FormLabel>TEXT:</FormLabel>
                      <Input />
                    </FormControl>
                  </Box>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>UPLOAD IMAGES:</FormLabel>
                      <Input type="file" style={{ paddingTop: "4px" }} />
                    </FormControl>
                  </Box>
                </Stack>

                <Button size="lg" className="bg-primary text-white">
                  Create
                </Button>
              </form>
            </Box>
          </div>
        </Stack>
      </Box>
    </>
  );
};

export default CreateSlider;
