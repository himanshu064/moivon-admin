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
  Checkbox,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { v4 as uuid } from "uuid";
import styles from "./index.module.css";
import React, { useState, useRef, useEffect } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { MAX_ALLOWED_IMAGES, MAX_IMAGE_SIZE_IN_MB } from "../../../constants";
import UploadImageView from "../../../components/UploadImageView";
import { ALL_QUERIES } from "../../../api/endpoints";
import { useSearchParams } from "react-router-dom";
import { EVENT_TABLES, PER_PAGE, START_PAGE, TAB_TYPES } from "../ListEvent";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import { prepareImageSrc } from "../../../api";
import { fetchAllGenres } from "../../../services/genre";

const MAX_ALLOWED_MOST_POPULAR_EVENT_SEQUENCE = 3;

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  startDate: yup.date("Invalid Date").required("Required"),
  endDate: yup.date("Invalid Date").required("Required"),
  price: yup.number("Invalid price").required("Required"),
  // mostPopularSeq: yup.number("Invalid number").required("Required"),
  // upComingSeq: yup.number("Invalid number").required("Required"),
});

const EditEventModal = ({ event, eventType = TAB_TYPES.all, tableType }) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [images, setImages] = useState([]);
  const fileUploadRef = useRef();
  const editEventFormRef = useRef();
  const toastId = useRef();
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };

  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const {
    type = eventType,
    page = START_PAGE,
    size = PER_PAGE,
    sortBy,
    orderBy,
  } = queryParams;

  const resetImageInput = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };
  const eventImagesLength = event?.images?.length || 0;

  const updateEventImages = () => {
    let eventImages = [];
    if (event?.images?.length) {
      eventImages = event?.images?.map((img) => ({
        _id: img._id,
        preview: prepareImageSrc(img.image),
      }));
    }
    setImages(eventImages);
  };

  useEffect(() => {
    if (isOpen) {
      updateEventImages();
      const config = { shouldTouch: true, shouldDirty: true };
      setValue("title", event.title, config);
      setValue("startDate", new Date(event.startDate), config);
      setValue("endDate", new Date(event.endDate), config);
      setValue("genre", event?.genre?._id, config);
      setValue("price", event.price, config);
      setValue("location", event.location, config);
      setValue("description", event.description, config);
      setValue("venue", event.venue, config);
      setValue("organization", event.organization, config);
      setValue("organizationUrl", event.organizationUrl, config);
      setValue("eventUrl", event.eventUrl, config);
      setValue("eventOrgDetail", event.eventOrgDetail, config);
      setValue("mostPopular", event.mostPopular, config);
      setValue("upComing", event.upComing, config);
      // setValue("mostPopularSeq", event.mostPopularSeq, config);
      // setValue("upComingSeq", event.upComingSeq, config);
      if (tableType === EVENT_TABLES.popular) {
        setValue("mostPopularSeq", event.mostPopularSeq, config);
      }

      if (tableType === EVENT_TABLES.upcoming) {
        setValue("upComingSeq", event.upComingSeq, config);
      }
    } else {
      resetImageInput();
      removeExistingToasts();
    }
  }, [isOpen, eventImagesLength]);

  const resolver = yupResolver(validationSchema);

  const { data: allGenres, isLoading: allGenresLoading } = useQuery(
    ALL_QUERIES.QUERY_ALL_GENRES(),
    fetchAllGenres
  );

  const mutation = useMutation(
    (newQuery) =>
      updateSingleEvent({
        images: newQuery.images,
        json_data: newQuery.data,
        eventId: event._id,
      }),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Event updated successfully!");
        reset();
        setImages([]);
        // refetch queries
        console.log(page, size);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({
            type,
            page,
            sort: sortBy,
            order: orderBy,
          }),
          () =>
            fetchAllEvents({ type, page, size, sort: sortBy, order: orderBy })
        );
        setTimeout(() => toast.remove(successId), 3000);
        onClose();
      },
    }
  );

  const onImageChange = (event) => {
    const { files } = event.target;
    const allFiles = Array.from(files);

    if (allFiles.length === 0) return;

    removeExistingToasts();
    resetImageInput();

    if (images.length === MAX_ALLOWED_IMAGES) {
      toastId.current = toast.error(
        `Maximum of ${MAX_ALLOWED_IMAGES} images are allowed!`
      );
      return;
    }

    const uploadableFiles = [];
    let isSomeFilesSkipped = false;
    let errorMessage = "";

    allFiles.forEach((file) => {
      const isAllowed = checkMaxFileSize(file.size, MAX_IMAGE_SIZE_IN_MB);
      if (isAllowed) {
        uploadableFiles.push({
          _id: `local_${uuid()}`,
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
      toastId.current = toast.error(errorMessage);
    }

    // set the images back to state
    setImages((prevFiles) => [...prevFiles, ...uploadableFiles]);
  };

  const onUpdateEvent = (data) => {
    let isMostPopularChecked = getValues("mostPopular");
    if (event.mostPopular) {
      isMostPopularChecked = false;
    }
    // cannot add more than 3 events as most favorite
    const cachedData = queryClient.getQueryData(
      ALL_QUERIES.QUERY_ALL_EVENTS({ type, page, sort: sortBy, order: orderBy })
    );
    if (cachedData?.data?.totalMostPopular >= 3 && isMostPopularChecked) {
      toastId.current = toast.error(
        "Cannot add more than 3 events to most favorite!"
      );
      return;
    }

    // cannot

    removeExistingToasts();
    toastId.current = toast.loading("Updating event...");
    data.published = event.published;

    mutation.mutate({
      images: images.map((image) => image.raw),
      data,
    });
  };
  const defaultValues = {
    title: event.title,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    genre: event.genre?._id,
    price: event.price,
    location: event.location,
    description: event.description,
    organization: event.organization,
    organizationUrl: event.organizationUrl,
    eventUrl: event.eventUrl,
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
    getValues,
  } = useForm({ resolver, mode: "onChange", defaultValues });

  const { mutate: deleteImageMutation } = useMutation(
    (imageId) => deleteEventImage({ imageId, eventId: event._id }),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Image deleted successfully!");
        setTimeout(() => toast.remove(successId), 3000);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_EVENTS({
            type,
            page,
            sort: sortBy,
            order: orderBy,
          }),
          () => fetchAllEvents({ type, page, sort: sortBy, order: orderBy })
        );
      },
    }
  );

  const onDeleteImage = ({ _id, preview }) => {
    if (isLocalImage(preview) === true) {
      // image is just a part of local state, so remove from local state
      setImages((prevImages) => {
        // return prevImages.filter((__, idx) => idx !== parseInt(index));
        return prevImages.filter(
          (existingImages) => existingImages._id !== _id
        );
      });
      resetImageInput();
      toastId.current = toast.success("Image removed successfully!");
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
        <RouteTitle title="Edit Event" />
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
                            <FormLabel>START DATE:</FormLabel>
                            <Controller
                              name="startDate"
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
                          <FormControl isRequired>
                            <FormLabel>END DATE:</FormLabel>
                            <Controller
                              name="endDate"
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
                            <Select
                              placeholder="Select option"
                              {...register("genre")}
                            >
                              {!allGenresLoading &&
                                allGenres?.data?.data?.map((genre) => (
                                  <option key={genre._id} value={genre._id}>
                                    {genre.genre}
                                  </option>
                                ))}
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
                            <FormLabel>EVENT DESCRIPTION:</FormLabel>
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
                          <p className="text-xs mt-2 text-green-600">
                            UPLOAD UP TO {MAX_ALLOWED_IMAGES} IMAGES/ VIDEOS (
                            {MAX_IMAGE_SIZE_IN_MB} MB MAX)
                          </p>
                        </Box>
                        <Box marginBottom="4">
                          <UploadImageView
                            allImages={images}
                            onDelete={onDeleteImage}
                          />
                        </Box>
                      </Stack>
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>Organization:</FormLabel>
                            <Input {...register("organization")} />
                          </FormControl>
                        </Box>
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>Organization URL:</FormLabel>
                            <Input {...register("organizationUrl")} />
                          </FormControl>
                        </Box>
                        <Box w={{ md: "50%" }}>
                          <FormControl isRequired>
                            <FormLabel>Event URL:</FormLabel>
                            <Input {...register("eventUrl")} />
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
                            <Textarea
                              {...register("eventOrgDetail")}
                              rows="5"
                            />
                          </FormControl>
                        </Box>
                      </Stack>
                      {tableType && (
                        <Stack spacing={5} direction="row">
                          {tableType === EVENT_TABLES.popular && (
                            <Box w={{ md: "50%" }}>
                              <FormControl>
                                <FormLabel>
                                  Most Popular Event Sequence:
                                </FormLabel>
                                <Select {...register("mostPopularSeq")}>
                                  <option value="">Select sequence</option>
                                  {[
                                    ...Array(
                                      MAX_ALLOWED_MOST_POPULAR_EVENT_SEQUENCE
                                    ),
                                  ].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                      {index + 1}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          )}
                          {tableType === EVENT_TABLES.upcoming && (
                            <Box w={{ md: "50%" }}>
                              <FormControl>
                                <FormLabel>Upcoming Event Sequence:</FormLabel>
                                <Input
                                  type="number"
                                  {...register("upComingSeq")}
                                />
                              </FormControl>
                            </Box>
                          )}
                        </Stack>
                      )}
                      <Stack spacing={5} direction="row" marginTop={4}>
                        <Checkbox
                          colorScheme="blue"
                          {...register("mostPopular")}
                        >
                          Most Popular Event
                        </Checkbox>
                        <Checkbox colorScheme="green" {...register("upComing")}>
                          Upcoming Event
                        </Checkbox>
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
