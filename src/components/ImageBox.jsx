import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { getFullImgURL } from "common";

const useStyles = makeStyles({
  image: {
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: (props) => `url(${props.src})`,
  },
});

export const ImageBox = ({ src, ...props }) => {
  const classes = useStyles({ src });

  return <Box className={classes.image} {...props} />;
};
