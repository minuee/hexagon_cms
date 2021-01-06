import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Avatar, Box, makeStyles, Fade, Badge, Grid, InputLabel } from "@material-ui/core";
import { Close, Add } from "@material-ui/icons";
import { useDropzone } from "react-dropzone";
import { RatioBox } from "components/RatioBox";
import { Button, Typography } from "components/materialui";

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
    },
  },
});

export const Dropzone = ({ control, name, width, ratio = 1, maxFiles = 1 }) => {
  const classes = useStyles();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
  });

  const onDropAccepted = (files) => {
    let count = Math.min(files.length, maxFiles - fields.length);

    for (let i = 0; i < count; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);

      reader.onload = () => {
        append({ file: files[i], path: reader.result });
      };
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    // maxSize: 10000,
    // maxFiles: 2,
    onDropAccepted,
  });

  return (
    <Box className={classes.container}>
      {/* <Button p={0} variant="contained">
        <InputLabel htmlFor="dropzone" variant="standard" style={{ padding: "10px" }}>
          <Typography fontWeight="500">파일 찾기</Typography>
        </InputLabel>
      </Button> */}

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

      {fields.map((item, index) => {
        return (
          <Box display="flex" alignItems="center" key={index}>
            <RatioBox width={width} ratio={ratio} border="solid 1px #dddddd" onClick={() => remove(index)}>
              <Controller
                as={<Avatar src={item.path} variant="square" className={classes.image} />}
                name={`${name}[${index}].file`}
                control={control}
                defaultValue={item.file}
              />
            </RatioBox>
            <Box ml={2}>
              <Typography>{item.file.name}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
