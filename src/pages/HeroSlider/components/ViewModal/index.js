import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";

import { FaRegEye } from "react-icons/fa";
import styles from "./index.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { prepareImageSrc } from "../../../../api";

function ViewModal({ slider }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <FaRegEye
        onClick={onOpen}
        className="cursor-pointer hover:bg-blue-800 mr-1"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader>View Slider</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {slider?.images?.map((img, idx) => (
                <SwiperSlide key={`view_slider_${idx}`}>
                  <div className={styles.wrapper}>
                    <div className={styles.image}>
                      <img
                        src={prepareImageSrc(img.image)}
                        alt="slider"
                        width="100%"
                      />
                    </div>
                    <Text>{slider?.description}</Text>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ViewModal;
