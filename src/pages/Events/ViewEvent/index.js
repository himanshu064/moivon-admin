import { Box, Highlight, Stack } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import PageHeader from "../../../components/PageHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import styles from "./index.module.css";

import { BsCurrencyDollar, BsCalendarWeek } from "react-icons/bs";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { fetchSingleEvent } from "../../../services/events";
import Loader from "../../../components/Loader";
import { ALL_QUERIES } from "../../../api/endpoints";
import { formatCurrency, getMapsLocation } from "../../../utils/helpers";
import { prepareImageSrc } from "../../../api";
import RouteTitle from "../../../components/RouteTitle/routeTitle";
import EventTypeRows from "../ListEvent/EventTypeRows";

const EventTypeWrapper = ({ children }) => {
  return <span className='mr-2'>{children}</span>;
};

const ViewEvent = () => {
  const { id: eventId } = useParams();

  const {
    data: singleEventData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_SINGLE_EVENT(eventId), () =>
    fetchSingleEvent(eventId)
  );

  if (isLoading) return <Loader />;

  if (isError) return <p>{error.toString()}</p>;

  return (
    <>
      <RouteTitle title='View Event' />
      <Box>
        <Stack flexDir='column'>
          <PageHeader title='View Event' />
          <div>
            <Stack direction='row'>
              <Box
                w={{ base: "100%", md: "60%" }}
                backgroundColor='#fff'
                padding=' 30px'
                borderRadius='10px'
                boxShadow='rgb(100 100 111 / 20%) 0px 7px 29px 0px'
              >
                <div className={styles.content}>
                  {singleEventData?.data?.data?.images.length > 0 && (
                    <img
                      src={prepareImageSrc(
                        singleEventData?.data?.data?.images?.[0]?.image
                      )}
                      style={{
                        height: 300,
                        objectFit: "cover",
                      }}
                      alt=''
                      width='100%'
                    />
                  )}

                  <div className={`${styles.topHeading}`}>
                    <h2 className='text-primary'>
                      {singleEventData?.data?.data?.title}
                    </h2>
                    {singleEventData?.data?.data?.genre && (
                      <span className={styles.type}>
                        {singleEventData?.data?.data?.genre?.genre}
                      </span>
                    )}
                    <div className='flex items-center gap-x-1 cursor-pointer'>
                      <Highlight
                        query={
                          singleEventData?.data?.data?.published
                            ? "Approved"
                            : "Pending"
                        }
                        styles={{
                          px: "1.5",
                          py: "1.5",
                          bg: singleEventData?.data?.data?.published
                            ? "green.200"
                            : "orange.200",
                          fontWeight: 500,
                        }}
                      >
                        {singleEventData?.data?.data?.published
                          ? "Approved"
                          : "Pending"}
                      </Highlight>
                    </div>
                  </div>
                  <h3 className='mt-3 mb-4 text-primary font-semibold text-lg'>
                    About Event
                  </h3>
                  <p>{singleEventData?.data?.data?.description}</p>
                </div>
                <Stack direction='row' spacing={10} mt='8'>
                  <Box
                    bg='#F8F8F8'
                    w={{ base: "100%", md: "50%" }}
                    padding='20px'
                    borderRadius='10px'
                    boxShadow='rgb(100 100 111 / 20%) 0px 7px 29px 0px'
                  >
                    <div className={`flex items-start gap-4 ${styles.detail}`}>
                      <BsCurrencyDollar />
                      <div className='div'>
                        <h4>Event Price</h4>
                        <p>
                          {singleEventData?.data?.data?.price !== 0
                            ? formatCurrency(singleEventData?.data?.data?.price)
                            : "FREE"}
                        </p>
                      </div>
                    </div>
                  </Box>
                  <Box
                    bg='#F8F8F8'
                    w={{ base: "100%", md: "50%" }}
                    padding='20px'
                    borderRadius='10px'
                    boxShadow='rgb(100 100 111 / 20%) 0px 7px 29px 0px'
                  >
                    <div className={`flex items-start gap-4 ${styles.detail}`}>
                      <BsCalendarWeek />
                      <div className='div'>
                        <h4>Date</h4>
                        <p>
                          {format(
                            new Date(singleEventData?.data?.data?.startDate),
                            "LLLL, dd LLL yyyy, hh:MM a"
                          )}{" "}
                          -
                        </p>

                        <p>
                          {format(
                            new Date(singleEventData?.data?.data?.endDate),
                            "LLLL, dd LLL yyyy, hh:MM a"
                          )}
                        </p>
                      </div>
                    </div>
                  </Box>
                </Stack>
                <div className={styles.aboutOrg}>
                  <h3 className='mt-4 mb-4 text-primary font-semibold text-lg'>
                    About Oranganisation
                  </h3>
                  <p>{singleEventData?.data?.data?.eventOrgDetail}</p>
                </div>
              </Box>
              <Box w={{ base: "100%", md: "40%" }} padding='0 0 30px 30px'>
                <Stack direction='column' spacing={10}>
                  <Box
                    padding='20px'
                    borderRadius='10px'
                    boxShadow='rgb(100 100 111 / 20%) 0px 7px 29px 0px'
                  >
                    <div className={`flex items-start gap-4 ${styles.detail}`}>
                      <IoLocationOutline />
                      <div className='div'>
                        <h4>Venue</h4>
                        <a
                          href={
                            singleEventData?.data?.data?.venue
                              ? getMapsLocation(
                                  singleEventData?.data?.data?.venue
                                )
                              : "#"
                          }
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <p>{singleEventData?.data?.data?.venue}</p>
                        </a>
                      </div>
                    </div>
                  </Box>
                  <Box
                    w={{ base: "100%", md: "100%" }}
                    padding='20px'
                    borderRadius='10px'
                    boxShadow='rgb(100 100 111 / 20%) 0px 7px 29px 0px'
                  >
                    <div className={`flex justify-between ${styles.detail}`}>
                      <div className='flex gap-4'>
                        <IoLocationOutline />
                        <div
                          className='div'
                          style={{ width: "300px", maxWidth: "100%" }}
                        >
                          <h4>Location</h4>
                          <p>
                            <a
                              href={
                                singleEventData?.data?.data?.venue
                                  ? getMapsLocation(
                                      singleEventData?.data?.data?.venue
                                    )
                                  : "#"
                              }
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <p>{singleEventData?.data?.data?.location}</p>
                            </a>
                            {/* <a
                              rel="noopener noreferrer"
                              target="_blank"
                              href={singleEventData?.data?.data?.location}
                            >
                              {singleEventData?.data?.data?.location}
                            </a> */}
                          </p>
                        </div>
                      </div>
                      <a
                        rel='noopener noreferrer'
                        target='_blank'
                        href={singleEventData?.data?.data?.location}
                      >
                        <HiOutlineArrowNarrowRight />
                      </a>
                    </div>
                  </Box>
                  <Box w={{ base: "100%", md: "100%" }}>
                    <h3 className='mb-4 text-primary font-semibold text-lg'>
                      Event Galleries
                    </h3>
                    {singleEventData?.data?.data?.images.length > 0 && (
                      <Swiper
                        className={styles.secondSlider}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        onSlideChange={() => console.log("slide change")}
                        onSwiper={(swiper) => console.log(swiper)}
                      >
                        {singleEventData?.data?.data?.images?.map(
                          (img, idx) => (
                            <SwiperSlide key={`slide_image_${idx}`}>
                              <img
                                src={prepareImageSrc(img.image)}
                                alt={`slide_image_${idx}`}
                                width='100%'
                              />
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>
                    )}
                  </Box>
                  {singleEventData?.data?.data && (
                    <EventTypeRows
                      event={singleEventData?.data?.data}
                      WrappingComponent={EventTypeWrapper}
                      mostPopularText='Most Popular Event'
                      upcomingText='Upcoming Event'
                    />
                  )}
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
