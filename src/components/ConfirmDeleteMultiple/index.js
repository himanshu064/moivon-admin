import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

const ConfirmDeleteMultiple = ({ children, type = "", onChildrenClick }) => {
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children && (
        <span className="cursor-pointer" onClick={onOpen}>
          {children}
        </span>
      )}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Multiple {type}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You want to delete multiple records.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onChildrenClick();
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmDeleteMultiple;
