import React, { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalOverlay,
  useDisclosure,
  Box,
  Stack,
  FormControl,
  FormLabel,
  ModalFooter,
  Button,
  ModalContent,
  Input,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import styles from "./index.module.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { fetchAllEmails, updateMailEvent } from "../../../services/mail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PER_PAGE, START_PAGE } from "../../Events/ListEvent";
import { ALL_QUERIES } from "../../../api/endpoints";
const validationSchema = yup.object({
  email: yup.string().required("Requited"),
});
const EditMailModel = ({ mail, page = START_PAGE, size = PER_PAGE }) => {
  const queryClient = useQueryClient();
  const resolver = yupResolver(validationSchema);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editMailFormRef = useRef();
  const toastId = useRef();
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };
  useEffect(() => {
    if (isOpen) {
      const config = { shouldTouch: true, shouldDirty: true };
      setValue("email", mail.email, config);
    } else {
      removeExistingToasts();
    }
  }, [isOpen]);
  const mutation = useMutation(
    (newQuery) =>
      updateMailEvent({
        email: newQuery.data,
        mailId: mail._id,
      }),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Mail updated successfully!");
        reset();
        // refetch queries
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_MAILS({ page, size }),
          () => fetchAllEmails({ page, size })
        );
        setTimeout(() => toast.remove(successId), 3000);
        onClose();
      },
    }
  );
  const onUpdateMail = (data) => {
    toastId.current = toast.loading("Updating mail....");
    mutation.mutate({
      data,
    });
  };
  const defaultValues = {
    email: mail.email,
  };
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
    setValue,
  } = useForm({ resolver, mode: "onChange", defaultValues });
  return (
    <>
      <FaRegEdit
        className="cursor-pointer hover:bg-green-500 mr-1"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <RouteTitle title="Edit Mail" />
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader>Edit Mail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px={{ md: "20px" }}>
              <Stack flexDir="column">
                <div className="form-div">
                  <Box w={{ base: "100%" }} bg={"white"} borderRadius="10px">
                    <form
                      className={styles.createForm}
                      ref={editMailFormRef}
                      onSubmit={handleSubmit(onUpdateMail)}
                    >
                      <Box w={{ md: "50%" }}>
                        <FormControl isRequired>
                          <FormLabel>Email:</FormLabel>
                          <Input {...register("email")} />
                        </FormControl>
                      </Box>
                    </form>
                  </Box>
                </div>
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              onClick={() => {
                editMailFormRef.current.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
              size="lg"
              className="bg-primary text-white"
              disabled={!isValid}
            >
              Update mail
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditMailModel;
