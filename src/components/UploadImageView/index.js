import { Box, Avatar } from "@chakra-ui/react";
import React from "react";
import { MdDelete } from "react-icons/md";
import classes from "./index.module.css";

const UploadImageView = ({ allImages = [], onDelete }) => {
  // const allImages = [
  //   ...localImages.map((image, index) => ({
  //     _id: `local_${index}`,
  //     preview: image.preview,
  //   })),
  //   ...(serverImages?.length > 0
  //     ? serverImages?.map((img) => ({
  //         _id: img._id,
  //         preview: prepareImageSrc(img.image),
  //       }))
  //     : []),
  // ];

  return (
    <div>
      {allImages.map((image, index) => (
        <Box className={classes.imageContainer} key={`uploaded_img_${index}`}>
          <Avatar alt={`Image_${index}`} src={image.preview} />
          <Box
            className={classes.delIconContainer}
            onClick={() => onDelete(image)}
          >
            <Box>
              <MdDelete size="24" fill="white" />
            </Box>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default UploadImageView;
