import React, { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

import { useDisclosure } from "@chakra-ui/react";
import styles from "./index.module.css";
import UploadImageView from "../../../../components/UploadImageView";

import { FaRegEdit } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { HERO_SLIDER_PER_PAGE, HERO_SLIDER_START_PAGE } from "../../SliderList";
import { updateSingleEvent } from "../../../../services/events";
import { ALL_QUERIES } from "../../../../api/endpoints";
import {
  deleteHeroSliderImage,
  fetchAllHeroSliders,
  updateHeroSlider,
} from "../../../../services/heroSlider";
import {
  MAX_ALLOWED_IMAGES,
  MAX_IMAGE_SIZE_IN_MB,
} from "../../../../constants";
import {
  checkMaxFileSize,
  isEmpty,
  isLocalImage,
} from "../../../../utils/helpers";
import { useForm } from "react-hook-form";
import { prepareImageSrc } from "../../../../api";

function EditModal({ slider }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryClient = useQueryClient();
  const [images, setImages] = useState([]);
  const fileUploadRef = useRef();
  const editSliderFormRef = useRef();
  const toastId = useRef();
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };

  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { page = HERO_SLIDER_START_PAGE, size = HERO_SLIDER_PER_PAGE } =
    queryParams;

  const resetImageInput = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };
  const sliderImagesLength = slider?.images?.length || 0;

  const updateSliderImages = () => {
    let eventImages = [];
    if (slider?.images?.length) {
      eventImages = slider?.images?.map((img) => ({
        _id: img._id,
        preview: prepareImageSrc(img.image),
      }));
    }
    setImages(eventImages);
  };

  useEffect(() => {
    if (isOpen) {
      updateSliderImages();
      const config = { shouldTouch: true, shouldDirty: true };
      setValue("description", slider.description, config);
    } else {
      resetImageInput();
      removeExistingToasts();
    }
  }, [isOpen]);

  useEffect(() => {
    updateSliderImages();
  }, [sliderImagesLength]);

  const mutation = useMutation(
    (newQuery) =>
      updateHeroSlider({
        images: newQuery.images,
        json_data: newQuery.data,
        sliderId: slider._id,
      }),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Event updated successfully!");
        reset();
        setImages([]);
        // refetch queries
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_HERO_IMAGES({ page, size }),
          () => fetchAllHeroSliders({ page, size })
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

    // if (images.length === MAX_ALLOWED_IMAGES) {
    //   toastId.current = toast.error(
    //     `Maximum of ${MAX_ALLOWED_IMAGES} images are allowed!`
    //   );
    //   return;
    // }

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
    // dont add up images
    setImages(uploadableFiles);
    // setImages((prevFiles) => [...prevFiles, ...uploadableFiles]);
  };

  const onUpdateSlider = (data) => {
    removeExistingToasts();
    toastId.current = toast.loading("Updating event...");

    // delete existing slider image if user uploads new
    const newImageSelected = images.some((img) =>
      img._id.toString().includes("local")
    );
    if (newImageSelected) {
      deleteImageMutation(slider?.images[0]?._id);
    }
    mutation.mutate({
      images: images.map((image) => image.raw),
      data,
    });
  };

  const defaultValues = {
    description: slider.description,
  };
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
    setValue,
  } = useForm({ mode: "onChange", defaultValues });

  const { mutate: deleteImageMutation } = useMutation(
    (imageId) => deleteHeroSliderImage({ imageId, eventId: slider._id }),
    {
      onSuccess: () => {
        removeExistingToasts();
        // const successId = toast.success("Image deleted successfully!");
        // setTimeout(() => toast.remove(successId), 3000);
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_HERO_IMAGES({ page, size }),
          () => fetchAllHeroSliders({ page, size })
        );
      },
    }
  );

  const onDeleteImage = ({ _id, preview }) => {
    if (isLocalImage(preview) === true) {
      // image is just a part of local state, so remove from local state
      console.log("Delete local");
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
                    <form
                      className={styles.createForm}
                      ref={editSliderFormRef}
                      onSubmit={handleSubmit(onUpdateSlider)}
                    >
                      <Stack
                        direction={["column", "row"]}
                        spacing="24px"
                        mb={5}
                      >
                        <Box w={{ md: "100%" }}>
                          <FormControl isRequired>
                            <FormLabel>TITLE:</FormLabel>
                            <Input {...register("description")} />
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
                            <FormLabel>UPLOAD IMAGE:</FormLabel>
                            <Input
                              type="file"
                              // multiple
                              style={{ paddingTop: "4px" }}
                              accept="image/*"
                              onChange={onImageChange}
                              ref={fileUploadRef}
                            />
                          </FormControl>
                        </Box>
                        <Box marginBottom="4">
                          <UploadImageView
                            allImages={images}
                            onDelete={onDeleteImage}
                          />
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
              size="lg"
              className="bg-primary text-white"
              onClick={() => {
                editSliderFormRef.current.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
              disabled={isSubmitting || !isValid || images.length === 0}
            >
              Update Slider
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditModal;
