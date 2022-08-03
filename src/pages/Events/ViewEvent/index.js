import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import PageHeader from "../../../components/PageHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import styles from "./index.module.css";

import { BsCurrencyDollar, BsCalendarWeek } from "react-icons/bs";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";

const ViewEvent = () => {
  return (
    <>
      <Box>
        <Stack flexDir="column">
          <PageHeader title="View Event" />
          <div>
            <Stack direction="row">
              <Box
                w={{ base: "100%", md: "60%" }}
                backgroundColor="#fff"
                padding=" 30px"
                borderRadius="10px"
                boxShadow="rgb(100 100 111 / 20%) 0px 7px 29px 0px"
              >
                <div className={styles.content}>
                  <img src="/img/bg.jpg" alt="" width="100%" />

                  <div className={`${styles.topHeading}`}>
                    <h2 className="text-primary">365 FRAMES-DAYS</h2>
                    <span className={styles.type}>Classic</span>
                  </div>
                  <h3 className="mt-3 mb-4 text-primary font-semibold text-lg">
                    About Event
                  </h3>
                  <p>
                    “I try to make work that joins the seductions of wishful
                    thinking with the criticality of knowing better,” Barbara
                    Kruger has said. An incisive critic of popular culture,
                    Kruger addresses the viewer directly as a way of exposing
                    the power dynamics underlying identity, desire, and
                    consumerism. Kruger’s large-scale commission for MoMA will
                    envelop the Marron Family Atrium with the artist’s bold
                    textual statements about truth, belief, and power. Combining
                    images drawn from mass-media photographs with provocatively
                    concise language, Kruger has been creating explorations of
                    social relationships imbued with her distinctive sense of
                    urgency and humor for more than 40 years. MoMA’s
                    installation will tap into the artist’s long-standing
                    interest in architecture to immerse viewers in a
                    thought-provoking environment, offering multiple points of
                    entry and perspective. With characteristic force, the work
                    will explore the ways that relationships between spatial and
                    political power invariably relate to considerations of
                    inclusion and exclusion, dominance and agency.
                  </p>
                </div>
                <Stack direction="row" spacing={10} mt="8">
                  <Box
                    bg="#F8F8F8"
                    w={{ base: "100%", md: "50%" }}
                    padding="20px"
                    borderRadius="10px"
                    boxShadow="rgb(100 100 111 / 20%) 0px 7px 29px 0px"
                  >
                    <div className={`flex items-start gap-4 ${styles.detail}`}>
                      <BsCurrencyDollar />
                      <div className="div">
                        <h4>Event Price</h4>
                        <p>$124,00</p>
                      </div>
                    </div>
                  </Box>
                  <Box
                    bg="#F8F8F8"
                    w={{ base: "100%", md: "50%" }}
                    padding="20px"
                    borderRadius="10px"
                    boxShadow="rgb(100 100 111 / 20%) 0px 7px 29px 0px"
                  >
                    <div className={`flex items-start gap-4 ${styles.detail}`}>
                      <BsCalendarWeek />
                      <div className="div">
                        <h4>Date</h4>
                        <p>Sunday, 12 June 2020</p>
                      </div>
                    </div>
                  </Box>
                </Stack>
                <div className={styles.aboutOrg}>
                  <h3 className="mt-4 mb-4 text-primary font-semibold text-lg">
                    About Oranganisation
                  </h3>
                  <p>
                    Libero et, lorem consectetur ac augue nisl. Nunc accumsan
                    rhoncus congue quisque at praesentyi vulputate consectetur.
                    Eu, auctor duis egestas nulla at praesentyi vulputate
                    consectetur nsectetur ac augu
                  </p>
                </div>
              </Box>
              <Box w={{ base: "100%", md: "40%" }} padding="0 0 30px 30px">
                <Stack direction="column" spacing={10}>
                  <Box
                    padding="20px"
                    borderRadius="10px"
                    boxShadow="rgb(100 100 111 / 20%) 0px 7px 29px 0px"
                  >
                    <div className={`flex items-start gap-4 ${styles.detail}`}>
                      <IoLocationOutline />
                      <div className="div">
                        <h4>Venue</h4>
                        <p>Birthday Event</p>
                      </div>
                    </div>
                  </Box>
                  <Box
                    w={{ base: "100%", md: "100%" }}
                    padding="20px"
                    borderRadius="10px"
                    boxShadow="rgb(100 100 111 / 20%) 0px 7px 29px 0px"
                  >
                    <div
                      className={`flex justify-between items-center ${styles.detail}`}
                    >
                      <div className="flex gap-4">
                        <IoLocationOutline />
                        <div className="div">
                          <h4>Location</h4>
                          <p>BOURBON ST, 40</p>
                        </div>
                      </div>
                      <HiOutlineArrowNarrowRight />
                    </div>
                  </Box>
                  <Box w={{ base: "100%", md: "100%" }}>
                    <h3 className="mb-4 text-primary font-semibold text-lg">
                      Event Galleries
                    </h3>
                    <Swiper
                      className={styles.secondSlider}
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      slidesPerView={1}
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      <SwiperSlide>
                        <img src="/img/bg.jpg" alt="" width="100%" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/img/bg.jpg" alt="" width="100%" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/img/bg.jpg" alt="" width="100%" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/img/bg.jpg" alt="" width="100%" />
                      </SwiperSlide>
                    </Swiper>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </div>
        </Stack>
      </Box>
    </>
  );
};

export default ViewEvent;
