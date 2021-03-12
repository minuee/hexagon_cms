import React, { useState, useEffect } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { getFullImgURL } from "common";

import { Box, makeStyles, IconButton } from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import { Typography } from "components/materialui";
import { RatioBox, ImageBox } from "components";

import { DetailImageModal } from "./DetailImageModal";

const useStyles = makeStyles((theme) => ({
  clear_button: {
    position: "absolute",
    cursor: "pointer",
    bottom: theme.spacing(-1),
    right: theme.spacing(-1),
  },
}));

export const Dropzone = ({
  control,
  name,
  width,
  ratio = 1,
  maxFiles = 1,
  minFiles = 0,
  readOnly,
  zoomable,
  ...props
}) => {
  const classes = useStyles();
  const [initialSlide, setInitialSlide] = useState(null);
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
    <Box {...props}>
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
          <Box mt={1} display="flex" alignItems="center" key={item.id}>
            <RatioBox position="relative" width={width} ratio={ratio} border="solid 1px #dddddd">
              <Controller
                render={() => (
                  <ImageBox
                    src={(item.file ? item.path : getFullImgURL(item.path)) || "/image/default.jpg"}
                    // type="cover"
                    clickable={zoomable}
                    onClick={() => setInitialSlide(index)}
                  />
                )}
                name={`${name}.[${index}]`}
                control={control}
                defaultValue={item}
              />

              {!readOnly && (
                <IconButton className={classes.clear_button} onClick={() => remove(index)}>
                  <Close />
                </IconButton>
              )}
            </RatioBox>

            <Box ml={2}>
              <Typography>{item.file?.name}</Typography>
            </Box>
          </Box>
        );
      })}

      {zoomable && (
        <DetailImageModal data={fields} initialSlide={initialSlide} handleClose={() => setInitialSlide(null)} />
      )}
    </Box>
  );
};
