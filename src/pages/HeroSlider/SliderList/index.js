import React, { useRef } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";

import RouteTitle from "../../../components/RouteTitle/routeTitle";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  AvatarGroup,
  Avatar,
  Text,
} from "@chakra-ui/react";
import ViewModal from "../components/ViewModal";
import EditModal from "../components/EditModal";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { RiDeleteBinLine } from "react-icons/ri";
import { ALL_QUERIES } from "../../../api/endpoints";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  deleteHeroSlider,
  deleteSingleHeroSlider,
  fetchAllHeroSliders,
} from "../../../services/heroSlider";
import { prepareImageSrc } from "../../../api";
import Pagination from "rc-pagination";
import Loader from "../../../components/Loader";
import { NOTIFICATION_DURATION } from "../../../constants";

export const HERO_SLIDER_START_PAGE = 1;
export const HERO_SLIDER_PER_PAGE = 10;

function SliderList() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};

  const navigate = useNavigate();

  const { page = HERO_SLIDER_START_PAGE, size = HERO_SLIDER_PER_PAGE } =
    queryParams;

  const toastId = useRef("");
  const removeExistingToasts = () => {
    if (toastId.current) {
      toast.remove(toastId.current);
    }
  };

  const commonErrorHandler = (error) => {
    removeExistingToasts();
    const err = error?.response?.data?.error;
    if (Array.isArray(err)) {
      const [originalError] = Object.values(err?.[0]);
      toastId.current = toast.error(originalError, NOTIFICATION_DURATION);
    } else if (typeof err === "string") {
      toastId.current = toast.error(err, NOTIFICATION_DURATION);
    } else {
      toastId.current = toast.error("Something went wrong!");
    }
  };

  const {
    data: sliderData,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_HERO_IMAGES({ page }), () =>
    fetchAllHeroSliders({ page, size })
  );

  const { mutate: onDeleteMutation } = useMutation(
    (sliderId) => deleteHeroSlider(sliderId),
    {
      onSuccess: () => {
        removeExistingToasts();
        toastId.current = toast.success(
          "Deleted successfully!",
          NOTIFICATION_DURATION
        );
        queryClient.refetchQueries(
          ALL_QUERIES.QUERY_ALL_HERO_IMAGES({ page }),
          () => fetchAllHeroSliders({ page, size })
        );
        removeExistingToasts();
      },
      onError: commonErrorHandler,
    }
  );

  const onPageChange = (current, pageSize) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        ...queryParams,
        page: current,
        size: pageSize,
      })}`,
    });
  };

  const onDeleteSlider = (sliderId) => {
    removeExistingToasts();
    toastId.current = toast.loading("Deleting...");
    onDeleteMutation(sliderId);
  };

  if (isLoading) return <Loader />;
  if (isError) return <h1>Error = {error.toString()}</h1>;

  return (
    <>
      <RouteTitle title="List Event" />
      <Box>
        <Stack flexDir="column">
          <PageHeader front="Hero Slider" title="List Slider" />
          <div>
            <Box w={{ base: "100%" }} bg={"white"}>
              {sliderData?.data?.data?.length > 0 ? (
                <TableContainer
                  style={{ border: "1px solid #eceff5", marginTop: "10px" }}
                >
                  <Table size="sm" variant="simple" className="list-event">
                    <React.Fragment>
                      <Thead>
                        <Tr>
                          <Th>Image</Th>
                          <Th>Title</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sliderData?.data?.data?.map((slider) => (
                          <Tr key={slider._id}>
                            <Td>
                              <AvatarGroup size="md" max={2}>
                                {slider.images.map((img, idx) => {
                                  const src = prepareImageSrc(img.image);
                                  return (
                                    <Avatar key={`image_${idx}`} src={src} />
                                  );
                                })}
                              </AvatarGroup>
                            </Td>

                            <Td>
                              <Text>{slider?.description}</Text>
                            </Td>
                            <Td>
                              <div className="flex items-center actions-btn">
                                <ViewModal slider={slider} />
                                <EditModal slider={slider} />
                                <ConfirmDialog
                                  type="Slider"
                                  onChildrenClick={() =>
                                    onDeleteSlider(slider._id)
                                  }
                                >
                                  <RiDeleteBinLine className="cursor-pointer hover:bg-red-500" />
                                </ConfirmDialog>
                              </div>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </React.Fragment>
                  </Table>
                  {sliderData?.data?.data?.length > 0 && (
                    <div className="text-right my-4">
                      <Pagination
                        defaultCurrent={page}
                        pageSize={size}
                        showLessItems
                        totalBoundaryShowSizeChanger={3}
                        total={sliderData?.data?.totalHeroImages}
                        onChange={onPageChange}
                        showTotal={(total, range) =>
                          `${range[0]} - ${range[1]} of ${total} items`
                        }
                      />
                    </div>
                  )}
                </TableContainer>
              ) : (
                <div className="bg-white text-center mt-12">
                  <h3 className="font-bold">No data found!</h3>
                </div>
              )}
            </Box>
          </div>
        </Stack>
      </Box>
    </>
  );
}

export default SliderList;
