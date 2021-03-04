import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { getFullImgURL } from "common";

import { Box, makeStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Typography } from "components/materialui";
import { RatioBox, ImageBox } from "components";

const useStyles = makeStyles({
  container: {
    marginTop: "1rem",
    width: "auto",
    "& > *": {
      marginRight: "1rem",
      marginBottom: "1rem",
    },
  },

  image: {
    "& img": {
      objectFit: "contain",
      objectPosition: "center center",
    },
  },
});

export const Dropzone = ({ control, name, width, ratio = 1, maxFiles = 1, minFiles = 0, readOnly }) => {
  const classes = useStyles();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
  });

  const onDropAccepted = async (files) => {
    let count = Math.min(files.length, maxFiles - fields.length);

    let tmp = [];
    for (let i = 0; i < count; i++) {
      let path = await getFilePath(files[i]);
      tmp.push({ file: files[i], path });
    }

    append(tmp);
  };

  function getFilePath(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    // maxSize: 10000,
    // maxFiles: 2,
    onDropAccepted,
  });

  return (
    <Box className={classes.container}>
      {fields.length < maxFiles && (
        <RatioBox
          width={width}
          ratio={ratio}
          border="dashed 1px #dddddd"
          {...getRootProps({ style: { cursor: "pointer" } })}
        >
          <input id="dropzone" {...getInputProps()} />
          <Box>
            <Add fontSize="large" />
          </Box>
        </RatioBox>
      )}

      {fields?.map((item, index) => {
        return (
          <Box display="flex" alignItems="center" key={item.id}>
            <RatioBox
              width={width}
              ratio={ratio}
              // border="solid 1px #dddddd"
              onClick={readOnly ? undefined : () => remove(index)}
            >
              <Controller
                render={() => (
                  <ImageBox src={(item.file ? item.path : getFullImgURL(item.path)) || "/image/default.jpg"} />
                )}
                name={`${name}.[${index}]`}
                control={control}
                defaultValue={item}
              />
            </RatioBox>
            <Box ml={2}>
              <Typography>{item.file?.name}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
