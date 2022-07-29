import React, { useRef } from "react";
import {
  Flex,
  Box,
  chakra,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { IoMdCheckmarkCircle } from "react-icons/io";

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  return (
    <div>
      <Flex
        w="full"
        bg="#edf3f8"
        _dark={{
          bg: "#3e3e3e",
        }}
        p={50}
        shadow="md"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          maxW="sm"
          w="full"
          mx="auto"
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          rounded="lg"
          overflow="hidden"
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            w={12}
            bg="green.500"
          >
            <Icon as={IoMdCheckmarkCircle} color="white" boxSize={6} />
          </Flex>

          <Box mx={-3} py={2} px={4}>
            <Box mx={3}>
              <chakra.span
                color="green.500"
                _dark={{
                  color: "green.400",
                }}
                fontWeight="bold"
              >
                Success
              </chakra.span>
              <chakra.p
                color="gray.600"
                _dark={{
                  color: "gray.200",
                }}
                fontSize="sm"
              >
                Your account was registered!
              </chakra.p>
            </Box>
          </Box>
        </Flex>
      </Flex>
      <Box ref={finalRef} tabIndex={-1} aria-label="Focus moved to this box">
        Some other content that'll receive focus on close.
      </Box>

      <Button mt={4} onClick={onOpen}>
        Open Modal
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>some body text</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Home;
