import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import PageHeader from "../../../components/PageHeader";
import styles from "./index.module.css";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { MAX_ALLOWED_IMAGES, MAX_IMAGE_SIZE_IN_MB } from "../../../constants";
import { checkMaxFileSize, isEmpty } from "../../../utils/helpers";
import UploadImageView from "../../../components/UploadImageView";
import { createHeroSlider } from "../../../services/heroSlider";

const CreateSlider = () => {
  const [images, setImages] = useState([]);
  const fileUploadRef = useRef();
  const toastId = useRef();
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };

  const resetImageInput = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

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
    setImages((prevFiles) => [...prevFiles, ...uploadableFiles]);
  };

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const onDeleteImage = (image) => {
    setImages((prevImages) =>
      prevImages.filter((img) => img._id !== image._id)
    );
  };

  const { mutate: createSliderMutation } = useMutation(
    ({ json_data, images }) =>
      createHeroSlider({
        json_data,
        images,
      }),
    {
      onSuccess: () => {
        removeExistingToasts();
        const successId = toast.success("Slider created successfully!");
        reset();
        setImages([]);
        setTimeout(() => toast.remove(successId), 3000);
      },
    }
  );

  const onCreateSlider = (data) => {
    removeExistingToasts();
    toastId.current = toast.loading("Creating slider...");
    createSliderMutation({
      json_data: data,
      images: images.map((image) => image.raw),
    });
  };

  return (
    <>
      <Box>
        <Stack flexDir="column">
          <PageHeader title="Create Slider Image" />
          <div className="form-div py-10">
            <Box
              w={{ base: "100%" }}
              bg={"white"}
              borderRadius="10px"
              padding="30px"
            >
              <form
                className={styles.createForm}
                // ref={formRef}
                onSubmit={handleSubmit(onCreateSlider)}
              >
                <Stack direction={["column", "row"]} spacing="24px" mb={5}>
                  <Box w={{ md: "50%" }}>
                    <FormControl>
                      <FormLabel>TEXT:</FormLabel>
                      <Input {...register("description")} />
                    </FormControl>
                  </Box>
                  <Box w={{ md: "50%" }}>
                    <FormControl isRequired>
                      <FormLabel>UPLOAD IMAGES:</FormLabel>
                      <Input
                        // multiple
                        type="file"
                        style={{ paddingTop: "4px" }}
                        onChange={onImageChange}
                        accept="image/*"
                        ref={fileUploadRef}
                        disabled={images.length === 1}
                      />
                    </FormControl>
                    <UploadImageView
                      allImages={images}
                      onDelete={onDeleteImage}
                    />
                  </Box>
                </Stack>

                <Button
                  size="lg"
                  type="submit"
                  className="bg-primary text-white"
                  disabled={isSubmitting || images.length === 0}
                >
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
