import React from "react";
import { getFullImgURL } from "common";

import { Box, Dialog, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { ImageBox } from "components";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export const DetailImageModal = ({ data, initialSlide, handleClose }) => {
  const isMultiple = data?.length > 1;

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={Number.isInteger(initialSlide)}
      onClose={handleClose}
      onBackdropClick={handleClose}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <IconButton onClick={handleClose}>
          <Close fontSize="large" />
        </IconButton>
      </Box>

      <Box p={4} width="100%">
        <Swiper
          initialSlide={initialSlide}
          navigation={isMultiple}
          grabCursor={isMultiple}
          allowSlideNext={isMultiple}
          allowSlidePrev={isMultiple}
        >
          {data?.map((item, index) => (
            <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
              <ImageBox
                width="750px"
                height="750px"
                src={(item.file ? item.path : getFullImgURL(item.path)) || "/image/default.jpg"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Dialog>
  );
};
