import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import DatePicker from "react-datepicker";
import styles from "./index.module.css";
import React, { useState, useRef, useEffect } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteEventImage,
  fetchAllEvents,
  updateSingleEvent,
} from "../../../services/events";
import {
  checkMaxFileSize,
  isEmpty,
  isLocalImage,
} from "../../../utils/helpers";
import { MAX_IMAGE_SIZE_IN_MB } from "../../../constants";
import UploadImageView from "../../../components/UploadImageView";
import { ALL_QUERIES } from "../../../api/endpoints";
import { useSearchParams } from "react-router-dom";
import { START_PAGE, TAB_TYPES } from "../ListEvent";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  dates: yup.date("Invalid Date").required("Required"),
  price: yup.number("Invalid price").required("Required"),
});

const EditEventModal = ({ event }) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [images, setImages] = useState([]);
  const fileUploadRef = useRef();
  const editEventFormRef = useRef();

  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { type = TAB_TYPES.all, page = START_PAGE } = queryParams;

  const resetImageInput = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isOpen) {
      const config = { shouldTouch: true, shouldDirty: true };
      setValue("title", event.title, config);
      setValue("dates", new Date(event.dates), config);
      setValue("price", event.price, config);
      setValue("location", event.location, config);
      setValue("description", event.description, config);
      setValue("venue", event.venue, config);
      setValue("eventOrgDetail", event.eventOrgDetail, config);
    } else {
      setImages([]);
      resetImageInput();
    }
  }, [isOpen]);

  console.log(images, "images goes here!");

  const resolver = yupResolver(validationSchema);

  const toastId = useRef(null);

  const mutation = useMutation(
    (newQuery) =>
      updateSingleEvent({
        images: newQuery.images,
        json_data: newQuery.data,
        eventId: event._id,
      }),
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        const successId = toast.success("Event updated successfully!");
        reset();
        setImages([]);
        // refetch queries
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
        setTimeout(() => toast.remove(successId), 3000);
        onClose();
      },
    }
  );

  const onImageChange = (event) => {
    const { files } = event.target;

    const uploadableFiles = [];
    let isSomeFilesSkipped = false;
    let errorMessage = "";

    Array.from(files).forEach((file) => {
      const isAllowed = checkMaxFileSize(file.size, MAX_IMAGE_SIZE_IN_MB);
      if (isAllowed) {
        uploadableFiles.push({
          raw: file,
          preview: URL.createObjectURL(file),
        });
      } else {
        isSomeFilesSkipped = true;
      }
    });

    if (isEmpty(uploadableFiles)) {
      errorMessage = `Please upload files with size less than ${MAX_IMAGE_SIZE_IN_MB}MB!`;
    } else if (isSomeFilesSkipped) {
      errorMessage = `Some of the images are not less than ${MAX_IMAGE_SIZE_IN_MB}MB!`;
    }

    // show the error message if the error flag is set
    if (errorMessage) {
      toast.error(errorMessage);
    }

    // set the images back to state
    setImages(uploadableFiles);
  };

  const onUpdateEvent = (data) => {
    toastId.current = toast.loading("Creating event...");
    mutation.mutate({
      images: images.map((image) => image.raw),
      data,
    });
  };

  const defaultValues = {
    title: event.title,
    dates: new Date(event.dates),
    price: event.price,
    location: event.location,
    description: event.description,
    venue: event.venue,
    eventOrgDetail: event.eventOrgDetail,
  };
  const {
    control,
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
    setValue,
  } = useForm({ resolver, mode: "onChange", defaultValues });

  console.log({ isValid, isDirty }, "isValid");

  const { mutate: deleteImageMutation } = useMutation(
    (imageId) => deleteEventImage(imageId),
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        const successId = toast.success("Image deleted successfully!");
        setTimeout(() => toast.remove(successId), 3000);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({ type, page }),
          () => fetchAllEvents({ type, page })
        );
      },
    }
  );

  const onDeleteImage = ({ _id, preview }) => {
    if (isLocalImage(preview) === true) {
      // image is just a part of local state, so remove from local state
      console.log("Delete local");
      const [_, index] = _id.split("_");
      setImages((prevImages) => {
        return prevImages.filter((__, idx) => idx !== parseInt(index));
      });
      resetImageInput();
      toast.success("Image removed successfully!");
    } else if (isLocalImage(preview) === false) {
      // image is from server, hit deleteImage mutation to remove from server
      deleteImageMutation(_id);
    }
  };

  return (
    <>
      {/* <FaRegEdit onClick={onOpen} /> */}
      <FaRegEdit
        className="cursor-pointer hover:bg-green-500 mr-1"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px={{ md: "20px" }}>
              <Stack flexDir="column">
                <div className="form-div">
                  <Box w={{ base: "100%" }} bg={"white"} borderRadius="10px">
                    <form
                      className={styles.createForm}
                      ref={editEventFormRef}
                      onSubmit={handleSubmit(onUpdateEvent)}
                    >
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>TITLE:</FormLabel>
                            <Input {...register("title")} />
                          </FormControl>
                        </Box>
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>VENUE:</FormLabel>
                            <Input {...register("venue")} />
                          </FormControl>
                        </Box>
                      </Stack>
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>DATE:</FormLabel>
                            <Controller
                              name="dates"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  className={styles.datePicker}
                                  selected={field.value}
                                  onChange={field.onChange}
                                  showTimeSelect
                                  dateFormat="Pp"
                                />
                              )}
                            />
                          </FormControl>
                        </Box>
                        <Box w={{ md: "50%" }}>
                          <FormControl>
                            <FormLabel>GENRE:</FormLabel>
                            <Select placeholder="Select option">
                              <option value="option1">Option 1</option>
                              <option value="option2">Option 2</option>
                              <option value="option3">Option 3</option>
                            </Select>
                          </FormControl>
                        </Box>
                      </Stack>
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>PRICE:</FormLabel>
                            <Input {...register("price")} />
                          </FormControl>
                        </Box>
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>LOCATION:</FormLabel>
                            <Input {...register("location")} />
                          </FormControl>
                        </Box>
                      </Stack>
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w="100%">
                          <FormControl isRequired>
                            <FormLabel>DESCRIPTION:</FormLabel>
                            <Textarea {...register("description")} rows="5" />
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
                              onChange={onImageChange}
                              accept="image/*"
                              ref={fileUploadRef}
                            />
                          </FormControl>
                        </Box>
                        <Box marginBottom="4">
                          <UploadImageView
                            localImages={images}
                            serverImages={event?.images}
                            onDelete={onDeleteImage}
                          />
                        </Box>
                      </Stack>
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w="100%">
                          <FormControl isRequired>
                            <FormLabel>
                              DESCRIBE YOUR EVENT ORGANIZATION:
                            </FormLabel>
                            <Textarea
                              {...register("eventOrgDetail")}
                              rows="5"
                            />
                          </FormControl>
                        </Box>
                      </Stack>
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
                editEventFormRef.current.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
              size="lg"
              className="bg-primary text-white"
              disabled={!isValid}
            >
              Update Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditEventModal;
