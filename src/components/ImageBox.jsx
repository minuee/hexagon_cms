import React from "react";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  image: {
    cursor: ({ clickable }) => clickable && "pointer",
    backgroundSize: ({ type }) => type || "contain",
    backgroundPosition: ({ position }) => position || "center",
    backgroundImage: ({ src }) => `url(${src})`,
    backgroundRepeat: "no-repeat",
  },
});

export const ImageBox = ({ src, type, position, clickable, ...props }) => {
  const classes = useStyles({ src, type, position, clickable });

  return <Box className={classes.image} {...props} />;
};
