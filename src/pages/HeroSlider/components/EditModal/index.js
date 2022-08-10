import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import styles from "./index.module.css";
import UploadImageView from "../../../../components/UploadImageView";

import { FaRegEdit } from "react-icons/fa";

function EditModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <FaRegEdit
        className="cursor-pointer hover:bg-green-500 mr-1"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader>Edit Slider</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px={{ md: "20px" }}>
              <Stack flexDir="column">
                <div className="form-div">
                  <Box w={{ base: "100%" }} bg={"white"} borderRadius="10px">
                    <form className={styles.createForm}>
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>TITLE:</FormLabel>
                            <Input />
                          </FormControl>
                        </Box>
                      </Stack>

                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "50%" }}>
                          <FormControl>
                            <FormLabel>UPLOAD EVENT:</FormLabel>
                            <Input
                              type="file"
                              multiple
                              style={{ paddingTop: "4px" }}
                              accept="image/*"
                            />
                          </FormControl>
                          <p className="text-xs mt-2 text-green-600">
                            UPLOAD UP TO MAX_ALLOWED_IMAGES IMAGES/ VIDEOS
                            MAX_IMAGE_SIZE_IN_MB MB MAX
                          </p>
                        </Box>
                        <Box marginBottom="4">
                          <UploadImageView />
                        </Box>
                      </Stack>
                    </form>
                  </Box>
                </div>
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button type="button" size="lg" className="bg-primary text-white">
              Update Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditModal;
