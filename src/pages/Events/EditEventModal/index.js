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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import DatePicker from "react-datepicker";
import styles from "./index.module.css";
import { useState, useRef, useEffect } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { updateSingleEvent } from "../../../services/events";
import { checkMaxFileSize, isEmpty } from "../../../utils/helpers";
import { MAX_IMAGE_SIZE_IN_MB } from "../../../constants";
import { prepareImageSrc } from "../../../api";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  dates: yup.date("Invalid Date").required("Required"),
  price: yup.number("Invalid price").required("Required"),
});

const EditEventModal = ({ event }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      console.log(event, "event");
      setValue("title", event.title, { shouldTouch: true });

      // const uploadableImages = event.images.map((image) => ({
      //   raw: prepareImageSrc(image),
      //   preview: image ? URL.createObjectURL(prepareImageSrc(image)) : null,
      // }));
      // setImages(uploadableImages);
      setValue("dates", new Date(utcToZonedTime(event.dates, "utc")), {
        shouldTouch: true,
      });
      setValue("price", event.price, { shouldTouch: true });
      setValue("location", event.location, { shouldTouch: true });
      setValue("description", event.description, { shouldTouch: true });
      setValue("venue", event.venue, { shouldTouch: true });
      setValue("eventOrgDetail", event.eventOrgDetail, { shouldTouch: true });
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
      }),
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        const successId = toast.success("Event created successfully!");
        reset();
        setImages([]);
        setTimeout(() => toast.remove(successId), 3000);
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
    dates: new Date(),
  };
  const {
    control,
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
    setValue,
  } = useForm({ resolver, mode: "onChange", defaultValues });

  return (
    <>
      {/* <FaRegEdit onClick={onOpen} /> */}
      <FaRegEdit
        className="cursor-pointer hover:bg-green-500 mr-1"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px={{ md: "20px" }}>
              <Stack flexDir="column">
                <div className="form-div py-10">
                  <Box w={{ base: "100%" }} bg={"white"} borderRadius="10px">
                    <form
                      className={styles.createForm}
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
                          <FormControl>
                            <FormLabel>UPLOAD EVENT:</FormLabel>
                            <Input
                              type="file"
                              multiple
                              style={{ paddingTop: "4px" }}
                              onChange={onImageChange}
                              accept="image/*"
                            />
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
                            <Textarea {...register("description")} />
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
                        <Box w="100%">
                          <FormControl isRequired>
                            <FormLabel>
                              DESCRIBE YOUR EVENT ORGANIZATION:
                            </FormLabel>
                            <Textarea {...register("eventOrgDetail")} />
                          </FormControl>
                        </Box>
                      </Stack>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-primary text-white"
                        disabled={!isDirty || !isValid || images.length === 0}
                      >
                        Create Event
                      </Button>
                    </form>
                  </Box>
                </div>
              </Stack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditEventModal;
