import React from "react";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  image: {
    cursor: ({ clickable }) => clickable && "pointer",
    backgroundSize: ({ type }) => type || "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: (props) => `url(${props.src})`,
  },
});

export const ImageBox = ({ src, type, clickable, ...props }) => {
  const classes = useStyles({ src, type, clickable });

  return <Box className={classes.image} {...props} />;
};
